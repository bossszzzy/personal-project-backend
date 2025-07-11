import { object, ref, string, number } from "yup";

export const createPlaySessionSchema = object({
  categoryId: number().required(),
  gameMode: string().oneOf(["choice", "clue", "imageTile"]).required(),
  numberOfQuestion: number().min(1).max(50).default(25),
  isTestSession: boolean().default(false).optional(),
});
