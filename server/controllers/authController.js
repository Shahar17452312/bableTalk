import bcrypt from "bcrypt";
import User from "../models/User.js";

const registerHandler=async(req,res)=>{
    const {email,name,password,preferredLanguage}=req.body;
    if(!email||!name||!password||!preferredLanguage){
        return res.status(400).json({message:"Missing fields"});
    }
    try{
        const checkUser=await User.findOne({
            email
        });

        if(checkUser){
            return res.status(400).json({message:"User is already registered"});
        }

        const hashPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            email,
            name,
            password:hashPassword,
            preferredLanguage
        });

        await newUser.save();

        return res.status(200).json({
            message:"User saved",
            email:newUser.email,
            name:newUser.name,
            preferredLanguage:newUser.preferredLanguage
        });



    }
    catch(error){
        console.error("error :",error.message);
        return res.status(error.status||500).json({message:error.message})
    }

};

const loginHandler=async(req,res)=>{

    const {email,password}=req.body;
    if(!email||!password){
        return res.status(400).json({message:"Missing fields"});
    }

    try{
        const user=await User.findOne({
            email
        });

        if(!user){
            return res.status(404).json({message:"No user with this email"});
        }


        try{
            const isPasswordValid =await bcrypt.compare(password,user.password);
            if(isPasswordValid ){
                return res.status(200).json({
                    email:user.email,
                    name:user.name,
                    preferredLanguage:user.preferredLanguage
                });
            }

        }
        catch(error){
            
        }

    }
    catch(error){

    }

}



export default {registerHandler,loginHandler};