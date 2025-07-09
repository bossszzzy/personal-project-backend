import express from "express";
import * as categoryController from "../controllers/category.controller.js";

const categoryRoute = express.Router();

categoryRoute.get("/", categoryController.getCategory);
categoryRoute.get("/:id", categoryController.getCategoryById);

export default categoryRoute;