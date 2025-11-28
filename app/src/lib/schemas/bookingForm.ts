import * as z from "zod";

export const newBookingFormSchema = z
  .object({
    listOfEvents: z
      .array(z.string())
      .min(1, "Legalább egy eseményt ki kell választani"),
    rule: z.string(),
    customRequest: z.object({
      operatingSystems: z.array(z.string()).optional(),
      internetAccess: z.boolean().default(true).optional(),
      forcedReset: z.object({
        beginning: z.boolean().optional(),
        end: z.boolean().optional()
      }).optional(),
      note: z
        .string()
        .max(500, "A megjegyzés maximum 500 karakter lehet")
        .optional(),
    }).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime) {
      const start = data.startTime;
      const end = data.endTime;
      if (start >= end) {
        ctx.addIssue({
          code: "custom",
          message:
            "A kezdő időpontnak korábbinak kell lennie, mint a záró időpont",
          input: data.endTime,
        });
      }
    }
  });

export const editBookingFormSchema = z.object({
  startTime: z.string(),
  endTime: z.string()
});
