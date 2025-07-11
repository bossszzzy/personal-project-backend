import * as playSessionService from "../services/playsession.service.js";
import { createError } from "../utils/createError.js";

export const createPlaySession = async (req, res, next) => {
  try {
    const { categoryId, gameMode, numberOfQuestion, isTestSession } = req.body;
    const userId = req.userMid;
    const result = await playSessionService.createPlaySession(
      userId,
      categoryId,
      gameMode,
      numberOfQuestion,
      isTestSession
    );
    if (!result) {
      createError(404, "No question found in this category and mode");
    }
    res.json({ message: "done", result });
  } catch (error) {
    next(error);
  }
};
export const getPlaySessionById = async (req, res, next) => {
  try {
    const id = +req.params.id;
    console.log("Received ID from params:", req.params.id); // ดูค่า string ดั้งเดิม
    console.log("Parsed ID:", id); // ดูค่าหลังจากแปลงเป็นตัวเลข
    const userId = req.userMid;
    const session = await playSessionService.getPlaySessionById(id, userId);

    if (!session) {
      createError(404, "Play session not found or unauthorized");
    }

    res.json({ session });
  } catch (error) {
    next(error);
  }
};

export const answerQuestion = async (req, res, next) => {
  try {
    const playSessionId = +req.params.id;
    const questionId = +req.params.questionId;
    const userId = req.userMid;
    const { choiceId } = req.body;

    const { status, answer } = await playSessionService.answerQuestion({
      playSessionId,
      questionId,
      userId,
      choiceId,
    });
    if (status === "unauthorized") {
      createError(403, "You are not allowed to answer in this session");
    }

    if (status === "not-found") {
      createError(404, "Question not found in this session");
    }

    if (status === "already-answered") {
      createError(400, "You have already answered this question");
    }

    if (status === "invalid-choice") {
      createError(400, "Invalid choice for this question");
    }

    res.json({ message: "Answer submitted", answer });
  } catch (error) {
    next(error);
  }
};

export const finishPlaySession = async (req, res, next) => {
  try {
    const playSessionId = +req.params.id;
    const userId = req.userMid;

    const result = await playSessionService.finishPlaySession(
      playSessionId,
      userId
    );

    if (!result) {
      createError(404, "Play session not found or unauthorized");
    }

    res.json({
      message: "Play session finished",
      totalScore: result.totalScore,
      answeredCount: result.answeredCount,
      totalQuestions: result.totalQuestions,
    });
  } catch (error) {
    next(error);
  }
};
export const getPlaySessionHistory = async (req, res, next) => {
  try {
    const userId = req.userMid;

    const history = await playSessionService.getPlaySessionHistory(userId);

    res.json({ history });
  } catch (error) {
    next(error);
  }
};
