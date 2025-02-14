import express from "express";
import env from "dotenv";
import connectDB from "./db.js";


const app=express();
env.config();
app.use(express.urlencoded({ extended: true }));

app.listen(3000,async()=>{
    await connectDB();
    console.log("Listening on port 3000");
})






