import { z } from "zod";
import { Role } from "../../generated/prisma/enums.js";

export const registerSchema = z.object({
    email: z.email(),

    password: z
        .string()
        .min(8)
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/[0-9]/),

    role: z.enum(Role),

    firstName: z.string(),

    lastName: z.string(),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});