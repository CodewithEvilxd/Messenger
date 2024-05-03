import { z } from "zod";

export const loginFormSchemaValidation = {
  email: z.string().email({
    message: "Please give a valid email id!",
  }),
  password: z.string().min(6, {
    message: "Password must be 6 characters long!",
  }),
};

export const loginFormSchema = z.object(loginFormSchemaValidation);

export type loginFormSchemaType = typeof loginFormSchema