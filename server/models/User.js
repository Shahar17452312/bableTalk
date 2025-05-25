import mongoose, { Mongoose } from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    preferredLanguage:{
        type:String,
        required:true
    },
    chats:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"ConverSation"
    }
    ]
})

const User=mongoose.model("user",userSchema);

export default User;