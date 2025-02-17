import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const getUser=async(req,res)=>{
   const token=checkToken(req,req.params.id);
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
            preferredLanguage:user.preferredLanguage
        });

    }

    catch(error){
        return res.status(500).json({message:error.message});
    }


};


const deleteUser=async(req,res)=>{
    const token=checkToken(req,req.params.id);
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

              return{
                message:"User updated",
                email:updatedUser.email,
                name:updatedUser.name,
                preferredLanguage:updatedUser.preferredLanguage,
                token:token
              }
        
        
    }

    catch(error){
        return res.status(500).json({message:error.message});
    }



}


function checkToken(req,id){
    const token = req.headers['authorization'];

    if (!token) {
        return {status:401,message:"token is required"};
    }
    try{
        const decoded =jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        if(decoded.id1!==req.params.id){
            return {status:401,message:"User ID mismatch"};
        }
        else{
            return {status:202,message:"Valid token"};
        }

    }
    catch(error){
        return {status:401,message:"Invalid or expired token"};
    }    

}



export default {getUser,deleteUser,updateUser};

