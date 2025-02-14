import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    messageContent: { 
        type: String, 
        required: true, 
        trim: true, 
        minlength: 1, 
        maxlength: 500 
    },
    timestamp: { 
        type: Date, 
        default: Date.now, 
        required: true 
    },
    language: { 
        type: String, 
        required: true 
    },
    translatedContent: { 
        type: String, 
        default: '' 
    }
});

const Message=mongoose.model("message",MessageSchema);

export default Message;