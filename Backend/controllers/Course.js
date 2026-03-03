const Course = require('../models/Course');
const Tag = require('../models/Tag');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');


//createCourse Handler function
exports.createCourse = async(req,res)=>{
    try{
        //fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;

        //fetch thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //check for instructor
        const userId  = req.user.id;
        const instructor = await User.findById(userId);
        console.log('instructor details', instructor);

        if(!instructor){
            return res.status(404).json({
                success:false,
                message:"Instructor not found"
            })
        }

        //check tag validation
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"Tag not found"
            })
        }

        //upload image
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            thumbnail:thumbnailImage.secure_url,
            instructor:instructor._id,
            tag:tagDetails._id
        })

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(instructor._id, {
            $push:{courses:newCourse._id}
        }, {new:true})

        //update the tag ka schema

        //return response
        return res.status(200).json({
            success:true,
            message:"Course created successfully",
            data:newCourse
        })

        
        

    }catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
}





//getAllCourses handler function

exports.showAllCourses = async(req,res)=>{
    try{
        const allCourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            ratingAndReviews:true,
            instructor:true,
            studentsEnrolled:true,
        }).populate('instructor').exec();

        return res.status(200).json({
            success:true,
            message:"All courses fetched successfully",
            data:allCourses
        })


    }catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
} 