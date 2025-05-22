import User from "../models/User.js";
import bcrypt from "bcrypt";
import ConverSation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { translate } from '@vitalets/google-translate-api';




const getUser=async(req,res)=>{

    try{
        if(req.userId!==req.params.id){
            return res.status(401).json({message:"not the same token for the current user"});
        }
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

    try{
        if(req.userId!==req.params.id){
            return res.status(401).json({message:"not the same token fot the current user"});
        }
        const user=await User.findByIdAndDelete(req.params.id);
        if(!user){
         return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({message:"User successfully deleted"});

    }

    catch(error){
        const status = error.status || 500;
            const message = error.message || "Internal server error";
            console.error("error :",error.message);
            return res.status(status).json({message:message})   
    }
};

const updateUser=async(req,res)=>{
  

    try{

        if(req.userId!==req.params.id){
           return res.status(401).json({message:"not the same token fot the current user"});
        }
        const detailsToUpdate={};

        Object.entries(req.body).forEach(([key, value]) => {
            if(value){
                detailsToUpdate[key]=value;
            }
        });
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
          });
        
    }

    catch(error){
         const status = error.status || 500;
        const message = error.message || "Internal server error";
        console.error("error :",error.message);
        return res.status(status).json({message:message})
    }



}




const getAllUsers=async(req,res)=>{

    try{
        console.log("userId: "+req.userId);
        console.log("req.params.id : "+req.params.id);
        if(req.userId!==req.params.id){
            return res.status(401).json({message:"not the same token fot the current user"});
        }
        const foundUsers=await User.find().select("_id name");
        if(foundUsers.length===0){
         return res.status(404).json({message:"User not found"});
        }        

        return res.status(200).json(foundUsers);

    }

    catch(error){
         const status = error.status || 500;
        const message = error.message || "Internal server error";
        console.error("error :",error.message);
        return res.status(status).json({message:message})
    }


}


const getAllConversations = async (req, res) => {
    try {
        if(req.userId!==req.params.id){
            return res.status(401).json({message:"not the same token for the current user"});
        }
        const chats = await ConverSation.find({ participants: req.params.id })
        .populate({ path: "participants", select: "_id name" })
        .populate({ path: "messages" });


        // אם אין צ'אטים תואמים
        if (chats.length === 0) {
            return res.status(200).json({ message: "There are no conversations yet" });
        }

        return res.status(200).json(chats);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



const addConversation=async(req,res)=>{

    try{
          if(req.userId!==req.params.id){
            return res.status(401).json({message:"not the same token for the current user"});
        }
        const {participantID}=req.body;

        const user=await User.findById(req.params.id);
        if(!user){
         return res.status(404).json({message:"User not found"});
        }

        const conversation=new ConverSation({
            participants:[req.params.id,participantID]
        });


        await conversation.save();
        var conversationAfterPopulate=await conversation.populate({path:"participants",select:"id name"});
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

    try{
          if(req.userId!==req.params.id){
            return res.status(401).json({message:"not the same token fot the current user"});
        }
        const {conversationID}=req.body;
        const foundConversation=await ConverSation.findById(conversationID);
        if(!foundConversation){
            return res.status(404).json({message:"Not found"});
        }
        await foundConversation.populate({path:"participants",select:"id name preferredLanguage"});
        const receiver = foundConversation.participants.find((participant) =>participant._id.toString()===req.body.message.receiverID);
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found in the conversation" });
        }

        
        const receiverLanguage = receiver.preferredLanguage;
        const translatedMessage=await translate(req.body.message.messageContent,{to:receiverLanguage});


        const newMessage = new Message({
            ...req.body.message,
            senderTranslation:req.body.message.messageContent,
            receiverTranslation:translatedMessage.text
        });
        const message=await newMessage.save();
        await message.populate();
        foundConversation.messages.push(newMessage);

        await foundConversation.save();
        await foundConversation.populate({path:"participants",select:"id name"});
        await foundConversation.populate({path:"messages"});

        return res.status(200).json({
            conversation:foundConversation,
            newMessage:message
        });// the new chat with the new message in it

    }

    catch(error){
        console.log(error.message);
        return res.status(500).json({message:error.message});
    }

}


const updateReadStatusInMessage=async(req,res)=>{
      if(req.userId!==req.params.id){
            return res.status(401).json({message:"not the same token fot the current user"});
        }
   try{
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










export default {getUser,deleteUser,updateUser,getAllUsers,getAllConversations,addConversation,addMessage,updateReadStatusInMessage};

