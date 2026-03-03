const Section  = require('../models/Section')
const Course = require('../models/Course');


exports.createSection = async(req,res)=>{
    try{
        //feth data 
        const {sectionName, courseId} = req.body;
        //valdation of data
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //create section
        const newSection = await Section.create({sectionName})
        //update course with section id
        const updateCourseDetails = await Course.findByIdAndUpdate(courseId, {
            $push:{courseContent:newSection._id}
        }, {new:true});
        //return response
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updateCourseDetails
        })



    }catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            message:'unable to create section, please try again'
        })
    }
}

exports.updateSection = async(req,res)=>{
    try{
        //data input
        const {sectionName, sectionId} = req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //update section
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
        //return response
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            
        })
        
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            message:'unable to update section, please try again'
        })
    }

}


exports.deleteSection = async(req,res)=>{
    try{
        //get id
        const {sectionId} = req.params;
        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        //return response
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully"
        })
 


    }catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            message:'unable to delete section, please try again'
        })
    }
}