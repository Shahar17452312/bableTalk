import mongoose from "mongoose";
const CoversationSchema=new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    createdAt: {
        type: Date, 
        default: Date.now
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Message' 
    }

});

const CoverSation=mongoose.model("conversation",CoversationSchema);

export default CoverSation;