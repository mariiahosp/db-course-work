import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .max(100, "Name must be at most 100 characters"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email")
    .max(255, "Email must be at most 255 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
export type RegisterFormValues = yup.InferType<typeof registerSchema>;
