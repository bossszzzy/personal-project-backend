import prisma from "../config/prisma.config.js";
import bcrypt from "bcryptjs";

export const findUser = async (username) => {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
};

export const register = async (
  username,
  password,
  firstName,
  lastName,
  image
) => {
  const hashPassword = bcrypt.hashSync(password, 10);
  return await prisma.user.create({
    data: {
      username,
      password: hashPassword,
      firstName,
      lastName,
      image,
    },
    omit: {
      password: true,
    },
  });
};

export const verifyPassword = async (username, password) => {
  const foundUser = await findUser(username);
  if (!foundUser) return null;
  const isMatch = bcrypt.compareSync(password, foundUser.password);
  return isMatch ? foundUser : null;
};

export const getMe = async (id) => {
  return await prisma.user.findFirst({
    where: {
      id: +id,
    },
    omit: {
      password: true,
    },
  });
};

export const updatePassword = async (id, newPassword) => {
  const hashPassword = await bcrypt.hash(newPassword, 10);
  const user = await prisma.user.update({
    where: {
      id: +id,
    },
    data: {
      password: hashPassword,
    },
  });
  return user;
};

