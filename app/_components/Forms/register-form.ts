import { z } from "zod";

export const registerFormValidation = {
  name: z.string().min(5, {
    message: "Name must be atleast 5 characters long!",
  }),
  email: z.string().email({
    message: "Please give a valid email id!",
  }),
  password: z.string().min(6, {
    message: "Password must be 6 characters long!",
  }),
};

export const registerFormSchema = z.object(registerFormValidation);

export type registerFormSchemaType = typeof registerFormSchema;
