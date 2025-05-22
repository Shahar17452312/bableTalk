import express from "express";
import userController from "../controllers/userController.js";
const router=express.Router();

router.get("/:id",userController.getUser);
router.put("/:id",userController.updateUser);
router.delete("/:id",userController.deleteUser);
router.post("/addConversation/:id",userController.addConversation)
router.get("/getAllUsers/:id", userController.getAllUsers);
router.get("/getConversations/:id",userController.getAllConversations);
router.post("/addMessage/:id",userController.addMessage);
router.post("/updateReadStatusInMessage/:id",userController.updateReadStatusInMessage);





export default router;