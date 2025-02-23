import CoverSation from "../models/Coversation.js";
import { checkToken } from "../util.js";

const getConversation=async(req,res)=>{
    const {userID}=req.body;

    try{
        const token=checkToken(req);
        if(token.status!==202){
            return res.status(token.status).json({message:token.message});
        }

        const conversation=await CoverSation.findById(req.params.id).populate("participants").populate("lastMessage");
        conversation.participants.forEach(user=>{
            if(user.id===userID){
                const coversationObject=conversation.toObject();
                return res.status(200).json({
                    ...coversationObject
                })
            }
        })

        return res.status(401).json({message:"You are not part of this conversation"});

    }

    catch(error){
        return res.status(500).json({messag:"Fail to look for conversation"});
    }
}




export default {getConversation};