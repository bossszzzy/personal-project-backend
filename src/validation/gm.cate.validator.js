import { object, ref, string, number } from "yup";

export const createAndUpdateCategory = object({
  name: string().min(1, "Category name is required"),
  description: string().min(1, "Description is required"),
  imageUrl: string().url("Invalid image URL"),
});
