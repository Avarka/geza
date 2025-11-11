import * as z from "zod";

export const bookingFormSchema = z.object({
  listOfEvents: z.array(z.string()).min(1, "Legalább egy eseményt ki kell választani"),
  listOfRules: z.array(z.string()),
  note: z.string().max(500, "A megjegyzés maximum 500 karakter lehet").optional(),
});