const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const {uploadVideoToCloudinary} = require('../utils/videoUploader');

exports.createSubsection = async(req,res)=>{
    try{
        //fetch data from req body
        const {sectionId, title, timeDuration, description} = req.body;
        //extract file/video
        const video = req.files.video;
        //validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //upload video to cloudinary
        const uploadDetails = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);
        //create a subSection
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
        })
        //update section with subSection objectId
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            $push:{subSections:subSectionDetails._id}
        }, {new:true});
        //return response
        return res.status(200).json({
            success:true,
            message:"Subsection created successfully",
            updatedSection
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            message:'unable to create subsection, please try again'
        })
    }

}




//HW: update subsection
//HW: delete subsection
