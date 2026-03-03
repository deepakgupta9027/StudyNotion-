const User = require('../models/User')
const OTP = require('../models/OTP')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();



//send OTP
exports.sendOTP = async(req,res)=>{
    try{
        //fetch email from body
        const {email} = req.body;

        //check if user alredy present
        const userPresent = await User.findOne({email});
        if(userPresent){
            return res.status.json({
                status:false,
                message:"User already present"
            })
        }

        //generate otp

        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })

        console.log('otp generated', otp);

        const result  = await OTP.findOne({otp:otp});
        if(result){
            otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        result  = await OTP.findOne({otp:otp});
    }

    const otpPayload = {email, otp};

    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
        status:true,
        message:"OTP sent successfully",
        otp
    })



    }catch(e){
        console.log(e);
        return res.status(500).json({
            status:false,
            message:e.message 
        })

    }


}


//signUp

exports.signUp = async(req,res)=>{
    try{
        //fetch data from body
        const {firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp} = req.body;

        //Validate
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                status:false,
                message:"All fields are required"
            })
        }

        //match password
        if(password !== confirmPassword){
            return res.status(400).json({
                status:false,
                message:"Password does not match"
            })
        }

        //check user already exists?
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                status:false,
                message:"User already exists"
            })
        }

        //find most recent otp
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        if(recentOtp.length == 0){
            return res.status(400).json({
                status:false,
                message:"OTP not found"
            })
        }else if(otp !== recentOtp.otp){
            return res.status(400).json({
                status:false,
                message:"Invalid OTP"
            })
        } 

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        //create entry in db
        const profileDetails  = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            contactNumber,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        //return response
        return res.status(200).json({
            status:true,
            message:"User created successfully",
            user
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            status:false,
            message:'user not registered, please try again'
        })
    
    }
};


//Login

exports.login = async(req,res)=>{
    try{
        //get data from body
        const {email, password} = req.body;

        //validation data
        if(!email || !password){
            return res.status(403).json({
                status:false,
                message:"All fields are required"
            })
        }
        //user check exists or not
        const user = await User.findOne({email}).populate('additionalDetails');
        if(!user){
            return res.status(404).json({
                status:false,
                message:"User not found"
            })
        }


        //generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType
            } 
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY,{
              expiresIn: '2h',
        })

        user.token = token;
        user.password = undefined;

        //create cookie and send response
         const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly:true
        }
        res.cookie('token', token, options).status(200).json({
            success:true,
            token,
            message:"User logged in successfully",
            user
        })
    }else{
        return res.status(401).json({
            status:false,
            message:"Password does not match"
        })
    }
        
       

    }catch(e){
        console.log(e);
        return res.status(500).json({
            status:false,
            message:'unable to login, please try again'
        })

    }
}


//Change Password
