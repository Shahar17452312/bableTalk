
import jwt from "jsonwebtoken";

const checkToken= (req)=>{
    const token = req.headers["authorization"].split(" ")[1];

    if (!token) {
        return {status:401,message:"token is required"};
    }
    try{
        const decoded =jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        if(decoded.id!==req.params.id){
            return {status:401,message:"User ID mismatch"};
        }
        else{
            return {status:202,message:"Valid token"};
        }

    }
    catch(error){
        return {status:401,message:"Invalid or expired token"};
    }    

};


export  {checkToken};