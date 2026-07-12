import { z } from "zod";

export const createDoctorSchema = z.object({
  specialization: z.string().min(2).max(100),

  qualification: z.string().min(2).max(100),

  experience: z.number().int().min(0).max(60),

  consultationFee: z.number().positive(),
});

export const searchDoctorSchema = z.object({
  specialization: z.string().min(2).optional(),

  qualification: z.string().min(2).optional(),

  minExperience: z.coerce.number().int().min(0).optional(),

  maxFee: z.coerce.number().positive().optional(),
});