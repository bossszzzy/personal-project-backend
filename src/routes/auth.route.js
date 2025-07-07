import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  registerSchema,
  loginSchema,
  validate,
} from "../validation/auth.validator.js";

const authRoute = express.Router();

authRoute.post("/register", validate(registerSchema), authController.register);
authRoute.post("/login", validate(loginSchema), authController.login);
authRoute.get("/me", authMiddleware, authController.getMe);
authRoute.post("/forgot-password", authController.forgotPassword);
authRoute.post("/reset-password/:token",authController.resetPassword)

export default authRoute;
