import * as userService from "../services/user.service.js";

export const getCategory = async (req, res, next) => {
  try {
    const categoryId = await userService.getCategory();
    console.log(categoryId);
    res.json({message:"Category",categoryId})
  } catch (error) {
    next(error)
  }
};
