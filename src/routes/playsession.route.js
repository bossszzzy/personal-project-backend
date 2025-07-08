import express from "express";
import * as playSessionController from "../controllers/playsession.controller.js";
import { createPlaySessionSchema, validate } from "../validation/playsession.validator.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const playSessionRoute = express.Router();

playSessionRoute.post('/',authMiddleware,validate(createPlaySessionSchema),playSessionController.createPlaySession)
playSessionRoute.get('/:id',authMiddleware,playSessionController.getPlaySessionById)
playSessionRoute.post('/:id/questions/:questionId/answer',authMiddleware,playSessionController.answerQuestion)
playSessionRoute.post('/:id/finish', authMiddleware, playSessionController.finishPlaySession)
playSessionRoute.get('/history', authMiddleware, playSessionController.getPlaySessionHistory)

export default playSessionRoute;
