import * as z from "zod";

export const bookingFormSchema = z.object({
  listOfEvents: z.array(z.string()).min(1, "At least one event must be selected"),
  listOfRules: z.array(z.string()),
});