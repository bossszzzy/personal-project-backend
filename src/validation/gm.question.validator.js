import { object, string, number, array, boolean } from "yup";

export const createAndUpdateQuestionSchema = object({
  categoryId: number().integer().positive().required("Category is required"),
  content: string().required("Content is required"),
  gameMode: string()
    .oneOf(["choice", "clue", "imageTile"], "Invalid game mode")
    .required(),
  mediaType: string()
    .oneOf(["image", "video", "sound", "none"], "Invalid media type")
    .required(),
  mediaUrl: string().url("Invalid URL").nullable().notRequired(),
  maxScore: number().integer().positive().required("Score is required"),
  choices: array()
    .of(
      object({
        choiceText: string().required("Choice text is required"),
        isCorrect: boolean().required(),
      })
    )
    .length(4, "Exactly 4 choices are required")
    .test(
      "exactly-one-correct",
      "Exactly one choice must be marked as correct",
      (choices) =>
        choices?.filter((c) => c.isCorrect).length === 1 
    ),
});

export const updateChoicesSchema = object({
  choices: array()
    .of(
      object({
        choiceText: string().required("Choice text is required"),
        isCorrect: boolean().required(),
      })
    )
    .length(4, "Exactly 4 choices are required")
    .test(
      "exactly-one-correct",
      "Exactly one choice must be marked as correct",
      (choices) => choices?.filter((c) => c.isCorrect).length === 1
    ),
});

