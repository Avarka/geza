import day from "@/lib/dayjs-ext";
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
    }).nullable(),
    startTime: z.string(),
    endTime: z.string(),
    file: z.file()
      .max(5e7, "A fájl mérete nem haladhatja meg a 50 MB-ot")
      .mime(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/zip", "application/x-rar-compressed"], "Csak PDF, DOC, DOCX, ZIP és RAR fájlok tölthetők fel")
      .optional()
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime) {
      const start = day(data.startTime, "HH:mm");
      const end = day(data.endTime, "HH:mm");
      if (start.isAfter(end)) {
        ctx.addIssue({
          code: "custom",
          message:
            "A kezdő időpontnak korábbinak kell lennie, mint a záró időpont",
          input: data.endTime,
        });
      }
    }
  });

export const createBookingFormSchema = z
  .object({
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
    }).nullable(),
    startTime: z.string(),
    endTime: z.string(),
    location: z.string(),
    neptunCode: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime) {
      const start = day(data.startTime);
      const end = day(data.endTime);
      if (start.isAfter(end)) {
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
