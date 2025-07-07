import * as authService from "../services/auth.service.js";
import { createError } from "../utils/createError.js";
import * as jsonwt from "../utils/jwt.js";

export const register = async (req, res, next) => {
  try {
    const { username, firstName, lastName, password, image } = req.body;
    let foundUser = await authService.findUser(username);
    console.log(foundUser);
    if (foundUser) {
      createError(401, "username already Exist!");
    }
    const result = await authService.register(
      username,
      password,
      firstName,
      lastName,
      image
    );
    res.json({ message: "Register success", result });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let foundUser = await authService.findUser(username);
    if (!foundUser) {
      createError(401, "Invalid username or password");
    }
    let checkPassword = await authService.verifyPassword(username, password);
    if (!checkPassword) {
      createError(401, "Invalid username or password");
    }

    const payload = {
      id: foundUser.id,
      role: foundUser.role,
    };

    const accessToken = jsonwt.generateToken(payload);

    res.json({
      message: `Welcome ${foundUser.firstName}`,
      role: foundUser.role,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};
export const getMe = async (req, res, next) => {
  try {
    const userId = req.userMid;
    const user = await authService.getMe(userId);
    if (!user) {
      createError(401, "Invalid user");
    }
    res.json({ result: user });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { username } = req.body;
    console.log(username)
    const user = await authService.findUser(username);
    if (!user) {
      createError(400, "Wrong username");
    }
    const userId = user.id
    console.log(userId)
    const token = jsonwt.resetToken(userId);
    const linkUrl = "http://localhost:6969/api/auth/reset-password";
    const link = `${linkUrl}/${token}`;
    res.json({ message: "link reset generate", link });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log(token)
  try {
    const payload = jsonwt.verifyResetToken(token);
    console.log(payload)
    const userId = payload.id
    const user = await authService.updatePassword(userId, password)
    res.json({message:"password update", user:{id: user.id, username: user.username}})
  } catch (error) {
    next(error)
  }
};
