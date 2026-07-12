import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

export async function getProfile(userId: string) {
  return prisma.profile.findUnique({
    where: {
      userId,
    },
  });
}

export async function updateProfile(
  userId: string,
  data: Prisma.ProfileUpdateInput,
) {
  return prisma.profile.update({
    where: {
      userId,
    },
    data,
  });
}
