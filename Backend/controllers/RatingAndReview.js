const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');

//createRating
exports.createRating = async(req,res)=>{
    try{
        //get userId
        const userId = req.user.id;
        //fetch data from req body
        const {rating, review, courseId} = req.body;
        //check if user is enrolled or not
        const courseDetails = await Course.findOne({_id:courseId,
                                                        studentsEnrolled:{
                                                            $elemMatch:{
                                                                $eq:userId
                                                            }
                                                        }
                                                    });

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"You are not enrolled in this course"
            })
        }

        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({user:userId, course:courseId});

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"You have already reviewed this course"
        })}

        //create rating and review
        const ratingAndReview = await RatingAndReview.create({rating,review, course:courseId,
            user:userId
        });

        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, {
            $push:{ratingAndReviews:ratingAndReview._id}
        }, {new:true});

        console.log(updatedCourseDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and review created successfully",
            ratingAndReview
        });


    }catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
}
//getAverageRating

exports.getAverageRating = async(req, res)=>{
    try{
        //get courseId
        const {courseId} = req.body;
        //calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{course:new mongoose.Types.ObjectId(courseId)}
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:'$rating'}
                }
            }
        ])

        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating
            })
        }

        //if no review/rating exists
        return res.status(200).json({
            success:true,
            message:"No rating found",
            averageRating:0
        })


    }catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
}

//getAllRating
exports.getAllRating = async(req,res)=>{
    try{
        const allReviews = await RatingAndReview.find({})
                                .sort({rating:'desc'})
                                .populate({
                                    path:'user',
                                    select: 'firstName lastName email image'
                                })
                                .populate({
                                    path:'course',
                                    select:'courseName'
                                })
                                .exec();


        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            allReviews
        });

    }catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
}