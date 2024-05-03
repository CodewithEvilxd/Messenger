import { z } from "zod";

export const createGroupFormSchemaValidation = {
  name: z.string().min(5, {
    message: "Group message must be at least 5 characters long.!",
  }),
  members: z.array(z.string()).min(1, {
    message: "Please add atleast one user",
  }),
};

export const createGroupFormSchema = z.object(createGroupFormSchemaValidation);

export type createGroupFormSchemaType = typeof createGroupFormSchema;
