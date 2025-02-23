import express from "express";
import conversationController from "../controllers/conversationController.js"
const router=express.Router();

router.get("/:id",conversationController.getConversation);


export default router;
