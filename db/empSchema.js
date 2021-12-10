const mongoose=require('mongoose');

const empSchema=new mongoose.Schema({
    fname:{
        type: String,
        required:'This field is required'
    },
    lname:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    }

})

module.exports=mongoose.model('emp',empSchema)