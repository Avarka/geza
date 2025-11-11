import * as z from "zod";

export const semesterCreate = z.object({
  name: z
    .string()
    .min(1, "A félév neve kötelező.")
    .max(10, "A félév neve legfeljebb 10 karakter lehet.")
    .regex(
      /^\d{4}\/\d{2} I{1,2}$/,
      "A félév neve a következő formátumban legyen: \"ÉÉÉÉ/ÉÉ I\" vagy \"ÉÉÉÉ/ÉÉ II\"."
    ),
  startDate: z.date(),
  endDate: z.date(),
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: "A befejező dátumnak később kell lennie, mint a kezdő dátum.",
    path: ["endDate"],
  }
)
