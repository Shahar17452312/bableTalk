import express from "express";
import env from "dotenv";
import connectDB from "./db.js";
import authRouter from "./routes/authRouter.js"


const app=express();
env.config();
app.use(express.urlencoded({ extended: true }));

app.use("/auth",authRouter);

app.listen(3000,async()=>{
    await connectDB();
    console.log("Listening on port 3000");
})






