import { object, ref, string } from "yup";

export const registerSchema = object({
  username: string()
    .min(6, "username must be at least 6 characters")
    .required("Input username"),
  password: string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .required("Input password"),
    confirmPassword: string().oneOf([ref("password"),null],"Not Correct").required("Input confirmpassword"),
  firstName: string().required("Input firstname"),
  lastName: string().required("Input lastname"),
});

export const loginSchema = object({
  username: string()
    .min(6, "username must be at least 6 characters")
    .required("Input username"),
  password: string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .required("Input password"),
});

