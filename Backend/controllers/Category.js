const Category = require('../models/Category');


//create category handler
exports.createCategory = async(req,res)=>{
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
        const categoryDetails = await Category.create({
            name:name,
            description:description
        
        })
        console.log(categoryDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:"Category created successfully",
           
        })

    }catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
}


//getAllTags handler

exports.showAllCategories = async(req,res)=>{
    try{
        const allCategories = await Category.find({}, {name:true, description:true});
        return res.status(200).json({
            success:true,
            message:"All categories fetched successfully",
            allCategories
        })
            

    }catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
}

//categoryPageDetails
exports.categoryPageDetails = async(req,res)=>{
    try{
        //get id
        const {categoryId} = req.body;
        //get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId)
        .populate('courses').exec();

        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Category not found"
            })
        }
        //get courses for different categories
        const differentCategories = await Category.find({_id:{$ne:categoryId}})
        .populate('courses').exec();
        //return response
        return res.status(200).json({
            success:true,
            message:"Category page details fetched successfully",
            data:{
                selectedCategory,
                differentCategories
            },
        })

    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }

}