import express from "express";
import * as gmController from "../controllers/gm.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createAndUpdateCategory } from "../validation/gm.cate.validator.js";
import { createAndUpdateQuestionSchema, updateChoicesSchema } from "../validation/gm.question.validator.js";
import { validate } from "../validation/run.validate.js";

const gmRoute = express.Router();

gmRoute.post(
  "/categories",
  authMiddleware,
  validate(createAndUpdateCategory),
  gmController.createCategory
);
gmRoute.patch(
  "/categories/:id",
  authMiddleware,
  validate(createAndUpdateCategory),
  gmController.updateCategory
);
gmRoute.delete("/categories/:id", authMiddleware, gmController.deleteCategory);

gmRoute.get(
  "/categories/:id/questions",
  authMiddleware,
  gmController.getQuestionsByCategory
);
gmRoute.post(
  "/questions",
  authMiddleware,
  validate(createAndUpdateQuestionSchema),
  gmController.createQuestion
);
gmRoute.put(
  "/questions/:id",
  authMiddleware,
  validate(createAndUpdateQuestionSchema),
  gmController.updateQuestion
);
gmRoute.delete("/questions/:id", authMiddleware, gmController.deleteQuestion);
gmRoute.put(
  "/questions/:id/choices",
  authMiddleware,
  validate(updateChoicesSchema),
  gmController.updateChoices
);

export default gmRoute;
