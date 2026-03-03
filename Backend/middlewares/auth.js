const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

//auth
exports.auth=(req,res,next)=>{
    try{
        const token = req.cookie.token || req.body.token || req.header("Authorization").replace('Bearer ', '');
        //if token is missing
        if(!token){
            return res.status(403).json({
                success:false,
                message:"A token is required for authentication"
            })
        }
        //verify token
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            console.log(decoded);
        }catch(e){
            return res.status(401).json({
                success:false,
                message:"Invalid token"
            })
        }

        next();
        
    }
    catch(e){
        return res.status(401).json({
            success:false,
            message:"something went wrong while validating the token"
        });
    }
} 

//isStudent
exports.isStudent = async(req,res,next)=>{
    try{
        if(req.user.accountType !== 'User'){
            return res.status(403).json({
                success:false,
                message:"This is the protected route for user only"
            })
        }
        next();

    }catch(e){
        return res.status(401).json({
            success:false,
            message:"something went wrong while validating isStudent"
        })
    }
}

//isInstructor
exports.isInstructor = async(req,res,next)=>{
    try{
        if(req.user.accountType !== 'Instructor'){
            return res.status(403).json({
                success:false,
                message:"This is the protected route for Instructor only"
            })
        }
        next();

    }catch(e){
        return res.status(401).json({
            success:false,
            message:"something went wrong while validating isInstructor"
        })
    }
}

//isAdmin

exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accountType !== 'Admin'){
            return res.status(403).json({
                success:false,
                message:"This is the protected route for Admin only"
            })
        }
        next();

    }catch(e){
        return res.status(401).json({
            success:false,
            message:"something went wrong while validating isAdmin"
        })
    }
}