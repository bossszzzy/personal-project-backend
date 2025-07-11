import { string, object, ref } from "yup";

export const registerSchema = object({
  username: string()
    .required("Input username")
    .min(6, "username must be at least 6 characters"),
  password: string()
    .required("Input password")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: string()
    .required("Input confirm password")
    .oneOf([ref("password"), null], "Password must match"),
  firstName: string().required("Input firstname"),
  lastName: string().required("Input lastname"),
}).noUnknown();

export const loginSchema = object({
  username: string()
    .required("Input username")
    .min(6, "username must be at least 6 characters"),
  password: string()
    .required("Input password")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
}).noUnknown();
