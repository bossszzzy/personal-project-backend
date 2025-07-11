import prisma from "../config/prisma.config.js";

export const createPlaySession = async (
  userId,
  categoryId,
  gameMode,
  numberOfQuestion,
  isTestSession
) => {
  const questions = await prisma.choiceQuestion.findMany({
    where: {
      categoryId,
      gameMode,
    },
  });
  if (questions.length === 0) {
    return null;
  }
  const shuffled = questions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, numberOfQuestion);
  const session = await prisma.playSession.create({
    data: {
      userId,
      categoryId,
      gameMode,
      isTestSession: isTestSession || false, 
      questions: {
        create: selected.map((q) => ({
          question: { connect: { id: q.id } },
        })),
      },
    },
    include: {
      questions: {
        include: { question: true },
      },
    },
  });
  return session;
};

export const getPlaySessionById = async (id, userId) => {
  const session = await prisma.playSession.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          question: {
            include: { choices: true },
          },
        },
      },
      answers: true,
    },
  });

  if (!session || session.userId !== userId) {
    return null;
  }

  return session;
};

export const answerQuestion = async ({
  playSessionId,
  questionId,
  userId,
  choiceId,
}) => {
  const result = {
    status: "ok",
    answer: null,
  };

  const session = await prisma.playSession.findUnique({
    where: { id: playSessionId },
  });
  if (!session || session.userId !== userId) {
    result.status = "unauthorized";
    return result;
  }

  const sessionQuestion = await prisma.playSessionQuestion.findUnique({
    where: {
      playSessionId_questionId: { playSessionId, questionId },
    },
  });
  if (!sessionQuestion) {
    result.status = "not-found";
    return result;
  }

  const existingAnswer = await prisma.playAnswer.findFirst({
    where: { playSessionId, questionId },
  });
  if (existingAnswer) {
    result.status = "already-answered";
    return result;
  }

  const choice = await prisma.choice.findUnique({
    where: { id: choiceId },
    include: { choiceQuestion: true },
  });
  if (!choice || choice.choiceQuestionId !== questionId) {
    result.status = "invalid-choice";
    return result;
  }

  const isCorrect = choice.isCorrect;
  const scoreEarned = isCorrect ? choice.choiceQuestion.maxScore : 0;

  const answer = await prisma.playAnswer.create({
    data: {
      playSessionId,
      questionId,
      choiceId,
      isCorrect,
      scoreEarned,
    },
  });

  await prisma.playSession.update({
    where: { id: playSessionId },
    data: {
      totalScore: {
        increment: scoreEarned,
      },
    },
  });

  result.answer = answer;
  return result;
};

export const finishPlaySession = async (playSessionId, userId) => {
  const session = await prisma.playSession.findUnique({
    where: { id: playSessionId },
    include: {
      answers: true,
      questions: true,
    },
  });
  if (!session || session.userId !== userId) {
    return null;
  }
  await prisma.playSession.update({
    where: { id: playSessionId },
    data: {
      isFinished: true,
    },
  });

  const totalScore = session.totalScore;
  const answeredCount = session.answers.length;
  const totalQuestions = session.questions.length;

  return { totalScore, answeredCount, totalQuestions };
};

export const getPlaySessionHistory = async (userId) => {
  const sessions = await prisma.playSession.findMany({
    where: { userId: userId },
    orderBy: { createAt: "desc" },
    include: {
      Category: true,
      answers: true,
      questions: true,
    },
  });

  return sessions.map((session) => ({
    id: session.id,
    category: session.Category?.name || "Unknown",
    totalScore: session.totalScore,
    isFinished: session.isFinished,
    createdAt: session.createAt,
    answeredCount: session.answers.length,
    totalQuestions: session.questions.length,
  }));
};
