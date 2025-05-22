import express from "express";
import env from "dotenv";
import connectDB from "./db.js";
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js";
import checkTokenMiddleware from "./util.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";


const app=express();
const server=http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

env.config();
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
  }));
  app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use("/auth",authRouter);
app.use("/user",checkTokenMiddleware,userRouter);


const usersMap = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    usersMap.set(userId, socket);
    console.log(`User ${userId} registered`);
  });

  socket.on("sendMessage", (message) => {
    const receiverSocket = usersMap.get(message.receiverID);
    console.log(message);
    if (receiverSocket) {
      receiverSocket.emit("receiveMessage", { ...message, conversationID:message.conversationID });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, s] of usersMap.entries()) {
      if (s.id === socket.id) {
        usersMap.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

server.listen(3000,async()=>{
    await connectDB();
    console.log("Listening on port 3000");
})






