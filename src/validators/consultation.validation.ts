import { z } from "zod";

export const consultationSchema = z.object({
  doctorId: z.cuid(),
  availabilitySlotId: z.string().cuid(),
  notes: z.string().optional(),
});