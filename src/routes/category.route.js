import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import { createPlaySessionSchema, validate } from "../validation/playsession.validator.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const categoryRoute = express.Router();

categoryRoute.get("/", categoryController.getCategory);
categoryRoute.get("/:id", categoryController.getCategoryById);

export default categoryRoute;