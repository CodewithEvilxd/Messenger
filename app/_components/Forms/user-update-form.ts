import { z } from "zod";

export const userUpdateFormSchemaValidation = {
  name: z
    .string()
    .min(5, {
      message: "User name must be atleast 5 characters long.",
    })
    .optional(),
  image: z
    .string()
    .min(1, {
      message: "User image cannot be empty",
    })
    .optional(),
};

export const userUpdateFormSchema = z.object(userUpdateFormSchemaValidation);

export type userUpdateFormSchemaType = typeof userUpdateFormSchema;
