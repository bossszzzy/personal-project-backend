import * as gmService from "../services/gm.service.js";
import { createError } from "../utils/createError.js";

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, imageUrl } = req.body;

    if (req.userRole !== "gm") {
      createError(403, "Forbidden");
    }

    const { status, category } = await gmService.createCategory({
      name,
      description,
      imageUrl,
    });

    if (status === "duplicate") {
      createError(400, "Category already exists");
    }

    res.status(201).json({
      message: "Category created",
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    if (req.userRole !== "gm") {
      createError(403, "Forbidden");
    }

    const categoryId = +req.params.id;
    const { name, description, imageUrl } = req.body;

    const { status, category } = await gmService.updateCategory(categoryId, {
      name,
      description,
      imageUrl,
    });

    if (status === "not-found") {
      createError(404, "Category not found");
    }

    if (status === "duplicate") {
      createError(400, "Category name already exists");
    }

    res.json({ message: "Category updated", category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    if (req.userRole !== "gm") {
      throw createError(403, "Forbidden");
    }

    const categoryId = +req.params.id;

    const status = await gmService.deleteCategory(categoryId);

    if (status === "not-found") {
      throw createError(404, "Category not found");
    }

    if (status === "has-questions") {
      throw createError(400, "Cannot delete category that has questions");
    }

    res.json({ message: "Category deleted" });
  } catch (error) {
    next(error);
  }
};

export const getQuestionsByCategory = async (req, res, next) => {
  try {
    if (req.userRole !== "gm") {
      throw createError(403, "Forbidden");
    }

    const categoryId = +req.params.id;

    const questions = await gmService.getQuestionsByCategory(categoryId);

    res.json({ questions });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  try {
    if (req.userRole !== "gm") {
      throw createError(403, "Forbidden");
    }

    const question = await gmService.createQuestion(req.body);
    
    res.status(201).json({ message: "Question created", question });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    if (req.userRole !== "gm") {
      throw createError(403, "Forbidden");
    }

    const questionId = +req.params.id;
    const question = await gmService.updateQuestion(questionId, req.body);

    if (!question) {
      throw createError(404, "Question not found");
    }

    res.json({ message: "Question updated", question });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    if (req.userRole !== "gm") {
      throw createError(403, "Forbidden");
    }

    const questionId = +req.params.id;

    const deleted = await gmService.deleteQuestion(questionId);

    if (!deleted) {
      throw createError(404, "Question not found");
    }

    res.json({ message: "Question deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateChoices = async (req, res, next) => {
  try {
    if (req.userRole !== "gm") {
      throw createError(403, "Forbidden");
    }

    const questionId = +req.params.id;
    const updated = await gmService.updateChoices(questionId, req.body.choices);

    if (!updated) {
      throw createError(404, "Question not found");
    }

    res.json({ message: "Choices updated", choices: updated });
  } catch (error) {
    next(error);
  }
};
