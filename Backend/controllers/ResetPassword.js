const User  = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
 

//reset password token
exports.resetPasswordToken = async(req,res)=>{
    try{
    //get email from body
    const email = req.body.email;
    //check user for this email , email validation 
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
    }

    //generate token
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updatedUser = await User.findOneAndUpdate({email:email}, {
        token:token,
        resetPasswordExpires:Date.now() + 5 * 60 * 1000
    }, {new:true});

    //create url
        const url = `https://localhost:3000/reset-password/${token}`;

    //send email containg the url
    await mailSender(email, 'Password Reset Link', url);

    //return response
    return res.json({
        success:true,
        message:"password reset link Email sent successfully"
    })
    



}
catch(e){
    console.log(e);
        return res.status(500).json({
            success:false,
            message:"something went wrong while reset password token"
        })
    }
    
}


//resetPassword
exports.resetPassword = async(req,res)=>{
    try{
        //data fetch
        const {password, confirmPassword, token} = req.body;

        //validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password does not match"
            })
        }
        //get user details
        const userDetails = await User.findOne({token:token});
        
        //if no entry - invalid token 
        if(!userDetails){
            return res.json({
                success:false,
                message:"Invalid token"
            })
        }

        //token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token expired"
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //update password
        await User.findOneAndUpdate({token:token}, {password:hashedPassword}, {new:true});

        //return response
        return res.json({
            success:true,
            message:"Password reset successfully"
        })        

    }catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            message:"something went wrong while reset password"
        })
    }

}