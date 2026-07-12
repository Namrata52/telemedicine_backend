import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";
import { NotFoundError } from "../errors/NotFoundError.js";
import { BadRequestError } from "../errors/BadRequestError.js";

export interface SearchDoctorInput {
  specialization?: string;
  qualification?: string;
  minExperience?: number;
  maxFee?: number;
}

export async function createDoctor(
  userId: string,
  data: Prisma.DoctorCreateWithoutUserInput,
) {
  const existingDoctor = await prisma.doctor.findUnique({
    where: {
      userId,
    },
  });

  if (existingDoctor) {
    throw new BadRequestError("Doctor profile already exists");
  }

  const doctor = await prisma.doctor.create({
    data: {
      ...data,
      user: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
        },
      },
    },
  });
  await prisma.auditLog.create({
    data: {
      userId,
      action: "CREATE_DOCTOR_PROFILE",
      entity: "Doctor",
      entityId: doctor.id,
    },
  });
  return doctor;
}

export async function getAllDoctors() {
  return prisma.doctor.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
        },
      },
    },
  });
}

export async function getDoctorById(id: string) {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
        },
      },
    },
  });

  if (!doctor) {
    throw new NotFoundError("Doctor not found");
  }

  return doctor;
}

export async function updateDoctor(
  userId: string,
  data: Prisma.DoctorUpdateInput,
) {
  const updatedDoctor = await prisma.doctor.update({
    where: {
      userId,
    },
    data,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
        },
      },
    },
  });
  await prisma.auditLog.create({
    data: {
      userId,
      action: "UPDATE_DOCTOR_PROFILE",
      entity: "Doctor",
      entityId: updatedDoctor.id,
    },
  });

  return updatedDoctor;
}

export async function searchDoctors(filters: SearchDoctorInput) {
  const where: Prisma.DoctorWhereInput = {};

  if (filters.specialization) {
    where.specialization = {
      contains: filters.specialization,
      mode: "insensitive",
    };
  }

  if (filters.qualification) {
    where.qualification = {
      contains: filters.qualification,
      mode: "insensitive",
    };
  }

  if (filters.minExperience !== undefined) {
    where.experience = {
      gte: filters.minExperience,
    };
  }

  if (filters.maxFee !== undefined) {
    where.consultationFee = {
      lte: filters.maxFee,
    };
  }

  return prisma.doctor.findMany({
    where,
    orderBy: {
      experience: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
        },
      },
    },
  });
}
