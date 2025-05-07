import User from "../models/User.js";
import bcrypt from "bcrypt";
import {checkToken} from "../util.js";
import ConverSation from "../models/Conversation.js";
import Message from "../models/Message.js";

const getUser=async(req,res)=>{
   const token=checkToken(req);
   if(token.status!==202){
    return res.status(token.status).json({message:token.message});
   }

    try{
        const user=await User.findById(req.params.id);
        if(!user){
         return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({
            email:user.email,
            name:user.name,
            preferredLanguage:user.preferredLanguage,

        });

    }

    catch(error){
        return res.status(500).json({message:error.message});
    }


};


const deleteUser=async(req,res)=>{
    const token=checkToken(req);
    if(token.status!==202){
     return res.status(token.status).json({message:token.message});
    }

    try{
        const user=await User.findById(req.params.id);
        if(!user){
         return res.status(404).json({message:"User not found"});
        }

        const result=await user.deleteOne();
        if(result.deletedCount===0){
            return res.status(500).json({message:"Failed to delete the user"});

        }
        return res.status(200).json({message:"User successfully deleted"});

    }

    catch(error){
        return res.status(500).json({message:error.message});
    }
};

const updateUser=async(req,res)=>{
    const token=checkToken(req,req.params.id);
    if(token.status!==202){
     return res.status(token.status).json({message:token.message});
    }

    const detailsToUpdate={};

    Object.entries(req.body).forEach(([key, value]) => {
        if(value){
            detailsToUpdate[key]=value;
        }
    });

    try{
           
        if(detailsToUpdate.password){
            const hash=await bcrypt.hash(detailsToUpdate.password,10);
            detailsToUpdate.password=hash;
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { 
              ...detailsToUpdate
            },
            { new: true } 
          );

          return res.status(200).json({
            message:"User updated",
            email:updatedUser.email,
            name:updatedUser.name,
            preferredLanguage:updatedUser.preferredLanguage,
            token:token
          });
        
    }

    catch(error){
        return res.status(500).json({message:error.message});
    }



}


const getAllUsers=async(req,res)=>{
    const token=checkToken(req);
    if(token.status!==202){
     return res.status(token.status).json({message:token.message});
    }

    try{
        const foundUsers=await User.find();
        if(!foundUsers){
         return res.status(404).json({message:"User not found"});
        }

        const users= foundUsers.map((user)=>{
            return {id:user.id,name:user.name};
        })

        return res.status(200).json(users);

    }

    catch(error){
        return res.status(500).json({message:error.message});
    }


}


const getAllConversations = async (req, res) => {
    try {
        const token = checkToken(req);
        if (token.status !== 202) {
            return res.status(token.status).json({ message: token.message });
        }

        const chats = await ConverSation.find({ participants: req.params.id })
        .populate({ path: "participants", select: "_id name" })
        .populate({ path: "messages" });

        console.log(JSON.stringify(chats));

        // אם אין צ'אטים תואמים
        if (chats.length === 0) {
            return res.status(401).json({ message: "There are no conversations yet" });
        }

        return res.status(200).json(chats);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



const addConversation=async(req,res)=>{

    const {participantID}=req.body;
    try{
        const token=checkToken(req);
        if(token.status!==202){
            return res.status(token.status).json({message:token.message});
        }

        const user=await User.findById(req.params.id);
        if(!user){
         return res.status(404).json({message:"User not found"});
        }

        const conversation=new ConverSation({
            participants:[req.params.id,participantID]
        });


        await conversation.save();
        var conversationAfterPopulate=await conversation.populate({path:"participants",select:"id name"});
        conversationAfterPopulate=await conversationAfterPopulate.populate({path:"messages"});
        console.log(conversationAfterPopulate);

        user.chats.push(conversation);

        await user.save();

        return res.status(201).json(conversationAfterPopulate);


    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({message:error.message});
    }
}


const addMessage=async(req,res)=>{
    const token=checkToken(req);
    if(token.status!==202){
        return res.status(token.status).json({message:token.message});
    }
    const {conversationID}=req.body;

    try{
        const foundConversation=await ConverSation.findById(conversationID);
        if(!foundConversation){
            return res.status(404).json({message:"Not found"});
        }
        const newMessage= new Message(
            req.body.message
        );
        await newMessage.save();
        foundConversation.messages.push(newMessage);
        console.log(foundConversation.messages);

        await foundConversation.save();
        await foundConversation.populate({path:"participants",select:"id name"});
        await foundConversation.populate({path:"messages"});

        return res.status(200).json(foundConversation);


    }

    catch(error){
        console.log(error.message);
        return res.status(500).json({message:error.message});
    }

}


const updateMessage=async(req,res)=>{
    console.log("in updateMessage");
   try{
        const token=checkToken(req);
       await Message.updateMany(
        {   
            isRead:false,
            senderID:req.body.senderID,
            receiverID:req.params.id

        },
        
            {$set:{isRead:true}}
        );

        return res.status(200).json({message:"all messages updated as read"});
   }
   catch(error){
    console.log(error.message);
    return res.status(500).json({message:error.message});
    }
}









export default {getUser,deleteUser,updateUser,getAllUsers,getAllConversations,addConversation,addMessage,updateMessage};

