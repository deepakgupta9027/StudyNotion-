const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = ()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(console.log("db connected successfully"))
    .catch((err)=>{
        console.log("error in dbConnection");
        console.error(err);
        process.exit(1);
    })
       
};

