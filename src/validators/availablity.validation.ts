import { z } from "zod";

export const availabilitySchema = z.object({
    doctorId: z.string().cuid(),

    startTime: z.iso.datetime(),

    endTime: z.iso.datetime(),
});