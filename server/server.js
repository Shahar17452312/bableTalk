import express from "express";
import env from "dotenv";
import connectDB from "./db.js";
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRouter.js";


const app=express();
env.config();
app.use(express.urlencoded({ extended: true }));

app.use("/auth",authRouter);
app.use("/user",userRouter);
app.use("/message",messageRouter);

app.listen(3000,async()=>{
    await connectDB();
    console.log("Listening on port 3000");
})






