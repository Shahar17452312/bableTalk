import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const registerHandler=async(req,res)=>{
  
    try{
        const {email,name,password,preferredLanguage}=req.body;
        if(!email||!name||!password||!preferredLanguage){
            return res.status(400).json({message:"Missing fields"});
        }
        const checkUser=await User.findOne({
            $or: [
                {email:email },
                { name:name }
            ]
        });

        if(checkUser){
            return res.status(400).json({message:"User is already registered"});
        }

        const hashPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            email:email,
            name:name,
            password:hashPassword,
            preferredLanguage:preferredLanguage,
        });

        const savedUser=await newUser.save();
        const userId=savedUser._id.toString();
        const accessToken=jwt.sign({id:userId},process.env.TOKEN_SECRET_KEY,{expiresIn:process.env.TOKEN_EXPIRES_IN});
        const refreshToken=jwt.sign({id:userId},process.env.REFRESH_TOKEN_SECRET_KEY,{expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN})
             res.cookie("accessToken", accessToken, {
                httpOnly: true,       // לא מאפשר גישה ל-cookie מצד ה-JS בדפדפן (מונע XSS)
                secure: process.env.NODE_ENV === "production", // שולח רק ב-HTTPS בפרודקשן
                sameSite: "none",  
                maxAge: 1000 * 60 * 1
            });
            res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,       // לא מאפשר גישה ל-cookie מצד ה-JS בדפדפן (מונע XSS)
                    secure: process.env.NODE_ENV === "production", // שולח רק ב-HTTPS בפרודקשן
                    sameSite: "none",  
                    maxAge: 1000 * 60 * 60 * 24 * 7
            });

        return res.status(200).json({
            _id:newUser._id,
            message:"User saved",
            email:newUser.email,
            name:newUser.name,
            preferredLanguage:newUser.preferredLanguage,
        });



    }
    catch(error){
         const status = error.status || 500;
        const message = error.message || "Internal server error";
        console.error("error :",error.message);
        return res.status(status).json({message:message})
    }

};

const loginHandler=async(req,res)=>{

   

    try{
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({message:"Missing fields"});
        }

        const user = await User.findOne({email:email });

        if(!user){
            return res.status(404).json({message:"No user with this email"});
        }


            const isPasswordValid =await bcrypt.compare(password,user.password);
            if(!isPasswordValid){
                return res.status(403).json({message:"Wrong Password"});
            }
            const userId=user._id.toString();
            const accessToken=jwt.sign({id:userId},process.env.TOKEN_SECRET_KEY,{expiresIn:process.env.TOKEN_EXPIRES_IN});
            const refreshToken=jwt.sign({id:userId},process.env.REFRESH_TOKEN_SECRET_KEY,{expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN})
             res.cookie("accessToken", accessToken, {
                httpOnly: true,       // לא מאפשר גישה ל-cookie מצד ה-JS בדפדפן (מונע XSS)
                secure: process.env.NODE_ENV === "production", // שולח רק ב-HTTPS בפרודקשן
                sameSite: "none",  
                maxAge: 1000 * 60 * 15 
            });
             res.cookie("refreshToken", refreshToken, {
                httpOnly: true,       // לא מאפשר גישה ל-cookie מצד ה-JS בדפדפן (מונע XSS)
                secure: process.env.NODE_ENV === "production", // שולח רק ב-HTTPS בפרודקשן
                sameSite: "none",  
                maxAge: 1000 * 60 * 15 
            });

            return res.status(200).json({
                        _id:userId,
                        message:"User saved",
                        email:user.email,
                        name:user.name,
                        preferredLanguage:user.preferredLanguage          
            });

    }
     catch(error){
         const status = error.status || 500;
        const message = error.message || "Internal server error";
        console.error("error :",error.message);
        return res.status(status).json({message:message})
    }

}
const refreshTokenHandler=(req, res) => {
    try{
        console.log("on refresh token handler");
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                console.log("no refresh token")
                return res.status(401).json({ message: "No refresh token provided" });
            }
            const decoded=jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
            const accessToken=jwt.sign({id:decoded.id},process.env.TOKEN_SECRET_KEY,{expiresIn:process.env.TOKEN_EXPIRES_IN});

            res.cookie("accessToken", accessToken, {
                httpOnly: true,       // לא מאפשר גישה ל-cookie מצד ה-JS בדפדפן (מונע XSS)
                secure: process.env.NODE_ENV === "production", // שולח רק ב-HTTPS בפרודקשן
                sameSite: "none",  
                maxAge: 1000 * 60 * 15 
            });

            return res.status(200).json({ message: "Access token refreshed" });
       
    }

      catch(error){
         const status = error.status || 500;
        const message = error.message || "Internal server error";
        console.error("error :",error.message);
        return res.status(status).json({message:message})
    }

  
};




export default {registerHandler,loginHandler,refreshTokenHandler};