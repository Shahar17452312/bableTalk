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


const getAllConversations=async(req,res)=>{

    try{
        const token=checkToken(req);
        if(token.status!==202){
            return res.status(token.status).json({message:token.message});
        }
        const chats=[];
        const conversation = await ConverSation.find()
        .populate({ path: "participants", select: "id name" })
        .populate({ path: "messages" });
      
        conversation.forEach((conversation)=>{
            conversation.participants.forEach((participant)=>{
                if(participant.id===req.params.id){
                    chats.push(conversation);
                }
            })

        })

        if(!chats){
            return res.status(401).json({message:"there is no conversations yet"});
        }
        return res.status(200).json(chats);


    }

    catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Fail to look for conversation"});
    }
}


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
        await conversation.populate({path:"participants",select:"id name"}).populate({path:"messages"});

        user.chats.push(conversation);

        await user.save();

        return res.status(201).json(conversation);


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










export default {getUser,deleteUser,updateUser,getAllUsers,getAllConversations,addConversation,addMessage};

