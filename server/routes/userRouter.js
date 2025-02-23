import express from "express";
import userController from "../controllers/userController.js";
const router=express.Router();

router.get("/:id",userController.getUser);
router.put("/:id",userController.updateUser);
router.delete("/:id",userController.deleteUser);
router.get("/getAllUsers/:id", userController.getAllUsers);





export default router;