import express from "express";
import conversationController from "../controllers/conversation.js"
const router=express.Router();

router.get("/:id",conversationController.getConversation);


export default router;
