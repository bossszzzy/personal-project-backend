import prisma from "../config/prisma.config.js";

export const getCategory = async () => {
  return await prisma.category.findMany();
};

export const getCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: {
      id: +id,
    },
  });
};

