import mongoose from "mongoose";
const CoversationSchema=new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    }],
    createdAt: {
        type: Date, 
        default: Date.now
    },
    messages:[ {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'message' 
    }]

});

const ConverSation=mongoose.model("conversation",CoversationSchema);

export default ConverSation;