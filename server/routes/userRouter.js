import express from "express";
import userController from "../controllers/userController.js";
const router=express.Router();

router.get("/:id",userController.getUser);
router.post("/add",userController.addUser);
router.post("/:id",userController.updateUser);
router.post("/:id",userController.deleteUser);





export default router;