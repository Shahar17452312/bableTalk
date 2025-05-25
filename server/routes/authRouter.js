import express from "express";
import authController from "../controllers/authController.js";
import checkTokenMiddleware from "../util.js";
const router=express.Router();

router.post("/register",authController.registerHandler);
router.post("/login",authController.loginHandler);
router.post("/refreshToken",authController.refreshTokenHandler);
router.post("/validate-token",checkTokenMiddleware,authController.validateToken)


export default router;