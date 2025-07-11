import * as categoryService from "../services/category.service.js";
import createError from "../utils/createError.js";

export const getCategory = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategory();
    res.json({ message: "Categories", categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const category = await categoryService.getCategoryById(id);
    if(!category){
      createError(404,"Not Found")
    }
    res.json({ message: "Category", category });
  } catch (error) {
    next(error);
  }
};