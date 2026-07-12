import { z } from "zod";

export const paymentSchema = z.object({
    consultationId: z.string().cuid(),
    amount: z.number().positive(),
});