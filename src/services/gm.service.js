import prisma from "../config/prisma.config.js";

export const createCategory = async ({ name, description, imageUrl }) => {
  const result = {
    status: "ok",
    category: null,
  };

  const exists = await prisma.category.findUnique({ where: { name } });
  if (exists) {
    result.status = "duplicate";
    return result;
  }

  const category = await prisma.category.create({
    data: { name, description, imageUrl },
  });

  result.category = category;
  return result;
};

export const updateCategory = async (id, { name, description, imageUrl }) => {
  const result = {
    status: "ok",
    category: null,
  };

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    result.status = "not-found";
    return result;
  }

  const nameUsed = await prisma.category.findFirst({
    where: {
      name,
      NOT: { id },
    },
  });
  if (nameUsed) {
    result.status = "duplicate";
    return result;
  }

  const updated = await prisma.category.update({
    where: { id },
    data: { name, description, imageUrl },
  });

  result.category = updated;
  return result;
};

export const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { choiceQuestions: true },
  });

  if (!category) {
    return "not-found";
  }

  if (category.choiceQuestions.length > 0) {
    return "has-questions";
  }

  await prisma.category.delete({ where: { id } });

  return "ok";
};

export const getQuestionsByCategory = async (categoryId) => {
  const questions = await prisma.choiceQuestion.findMany({
    where: { categoryId },
    include: {
      choices: true,
    },
    orderBy: { id: "asc" },
  });

  return questions.map((q) => ({
    id: q.id,
    content: q.content,
    gameMode: q.gameMode,
    mediaType: q.mediaType,
    mediaUrl: q.mediaUrl,
    maxScore: q.maxScore,
    createdAt: q.createAt,
    choices: q.choices.map((c) => ({
      id: c.id,
      choiceText: c.choiceText,
    })),
  }));
};

export const createQuestion = async ({
  categoryId,
  content,
  gameMode,
  mediaType,
  mediaUrl,
  maxScore,
  choices,
}) => {
  const question = await prisma.choiceQuestion.create({
    data: {
      categoryId,
      content,
      gameMode,
      mediaType,
      mediaUrl,
      maxScore,
      choices: {
        create: choices.map((choice) => ({
          choiceText: choice.choiceText,
          isCorrect: choice.isCorrect,
        })),
      },
    },
    include: {
      choices: true,
    },
  });

  return question;
};

export const updateQuestion = async (id, data) => {
  const {
    categoryId,
    content,
    gameMode,
    mediaType,
    mediaUrl,
    maxScore,
    choices,
  } = data;

  const existing = await prisma.choiceQuestion.findUnique({
    where: { id },
    include: { choices: true },
  });

  if (!existing) return null;

  await prisma.choice.deleteMany({
    where: { choiceQuestionId: id },
  });

  const updated = await prisma.choiceQuestion.update({
    where: { id },
    data: {
      categoryId,
      content,
      gameMode,
      mediaType,
      mediaUrl,
      maxScore,
      choices: {
        create: choices.map((c) => ({
          choiceText: c.choiceText,
          isCorrect: c.isCorrect,
        })),
      },
    },
    include: { choices: true },
  });

  return updated;
};

export const deleteQuestion = async (id) => {
  const question = await prisma.choiceQuestion.findUnique({ where: { id } });
  if (!question) return false;

  await prisma.choiceQuestion.delete({ where: { id } });

  return true;
};

export const updateChoices = async (questionId, newChoices) => {
  const question = await prisma.choiceQuestion.findUnique({
    where: { id: questionId },
  });

  if (!question) return null;

  await prisma.choice.deleteMany({ where: { choiceQuestionId: questionId } });

  const createdChoices = await prisma.choice.createMany({
    data: newChoices.map((choice) => ({
      choiceText: choice.choiceText,
      isCorrect: choice.isCorrect,
      choiceQuestionId: questionId,
    })),
  });

  return newChoices;
};
