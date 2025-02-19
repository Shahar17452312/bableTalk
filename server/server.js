import express from "express";
import env from "dotenv";
import connectDB from "./db.js";
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js";
import coversationRouter from "./routes/conversationRouter.js"
import cors from "cors";


const app=express();
env.config();
app.use(cors({
    origin: "http://localhost:5173"
  }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use("/auth",authRouter);
app.use("/user",userRouter);
app.use("/coversation",coversationRouter);

app.listen(3000,async()=>{
    await connectDB();
    console.log("Listening on port 3000");
})






