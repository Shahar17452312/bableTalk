import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    senderID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    receiverID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    messageContent: { 
        type: String, 
        required: true, 
        trim: true, 
        minlength: 1
        },
    timestamp: { 
        type: Date, 
        default: Date.now, 
        required: true 
    },
    language: { 
        type: String, 
        required: true 
    }
});

const Message=mongoose.model("message",MessageSchema);

export default Message;