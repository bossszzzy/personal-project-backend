import prisma from "../config/prisma.config.js"

export const getCategory = async () =>{
  return await prisma.category.findMany()
}