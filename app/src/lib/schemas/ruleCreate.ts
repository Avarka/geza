import * as z from "zod";

export const ruleCreate = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  action: z.json().default({}).optional(),
})