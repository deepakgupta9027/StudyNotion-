const Profile = require('../models/Profile');
const User = require('../models/User');


exports.updateProfile = async(req,res)=>{
    try{
        //get data
        const {dateOfBirth = '',  about = '', gender, contactNumber} = req.body;
        //get userId
        const id  = req.user.id;
        //validation
        if(!contactNumber || !gender || id){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();
        //return response
        return res.status(200).json({
            sucess:true,
            message:"Profile updated successfully",
            profileDetails
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            message:'unable to update profile, please try again'
        })
    }
}


exports.deleteAccount = async(req,res)=>{
    try{
        //get id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //delete user
        await User.findByIdAndDelete({_id:id});
        //return response
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully"
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            message:'unable to delete account, please try again'
        })
    }
}


exports.getAllUserDetails = async(req,res) => {
    try{
        //get id
        const id = req.user.id;
        //validation and get user details
        const userDetails = await User.findById(id).populate('additionalDetails').exec();
        return res.status(200).json({
            success:true,
            message:"User details fetched successfully",
            userDetails
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            message:'unable to get user details, please try again'
        })
    }
}