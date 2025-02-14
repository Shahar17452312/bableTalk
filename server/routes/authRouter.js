import express from "express";
import authController from "../controllers/authController.js";
const router=express.Router();

router.post("/register",authController.registerHanler);
router.post("/login",authController.loginHandler);

export default router;