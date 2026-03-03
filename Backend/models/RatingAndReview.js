const mongoose = require('mongoose');
const { use } = require('react');

const ratingAndReviews = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        required:true
    }
});


module.exports = mongoose.model('RatingAndReviews', ratingAndReviews);