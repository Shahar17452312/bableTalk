import mongoose from "mongoose";
const CoversationSchema=new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required:true 
    }],
    messages:[ {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'message',
    }],
    createdAt: {
        type: Date, 
        default: Date.now
    },
    

});

const ConverSation=mongoose.model("conversation",CoversationSchema);

export default ConverSation;