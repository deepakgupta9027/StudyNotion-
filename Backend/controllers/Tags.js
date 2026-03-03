const Tag = require('../models/Tag');


//create tag handler
exports.createTag = async(req,res)=>{
    try{
        //fetch data from body
        const {name, description} = req.body;

        //Vlaidation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //create entry in db
        const tagDetails = await Tag.create({
            name:name,
            description:description
        
        })
        console.log(tagDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:"Tag created successfully",
           
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
}


//getAllTags handler

exports.getAllTags = async(req,res)=>{
    try{
        const allTags = await Tag.find({}, {name:true, description:true});
        return res.status(200).json({
            success:true,
            message:"All tags fetched successfully",
            allTags
        })
            

    }catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
}