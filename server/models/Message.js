import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    senderID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user", 
        required: true 
    },
    receiverID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    messageContent: { 
        type: String, 
        required: true, 
        trim: true, 
        minlength: 1
        },
    senderTranslation: 
    { type: String, 
        required: true 
    },
    receiverTranslation: { 
        type: String, 
        required: true 
    },  
    isRead:{
        type:Boolean,
        required:true,
        default:false
    },
    createdAt: { 
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