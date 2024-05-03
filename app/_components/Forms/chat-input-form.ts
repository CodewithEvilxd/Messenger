import { z } from "zod";

export const chatInputFormSchemaValidation = {
  body: z.string(),
};

export const chatInputFormSchema = z.object(chatInputFormSchemaValidation);

export type chatInputFormSchemaType = typeof chatInputFormSchema;
