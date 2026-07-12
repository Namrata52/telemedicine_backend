import prisma from "../config/prisma.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

interface CreatePrescriptionInput {
  consultationId: string;
  medicines: string;
  instructions?: string;
}

export async function createPrescription(data: CreatePrescriptionInput) {
  const consultation = await prisma.consultation.findUnique({
    where: {
      id: data.consultationId,
    },
    include: {
      prescription: true,
    },
  });

  if (!consultation) {
    throw new NotFoundError("Consultation not found");
  }

  if (consultation.prescription) {
    throw new BadRequestError("Prescription already exists");
  }

  const prescription = await prisma.prescription.create({
    data: {
      consultation: {
        connect: {
          id: data.consultationId,
        },
      },
      medicines: data.medicines,
      instructions: data.instructions ?? null,
    },
    include: {
      consultation: true,
    },
  });
  await prisma.auditLog.create({
    data: {
      userId: consultation.patientId,
      action: "CREATE_PRESCRIPTION",
      entity: "Prescription",
      entityId: prescription.id,
    },
  });
  return prescription;
}

export async function getAllPrescriptions() {
  return prisma.prescription.findMany({
    include: {
      consultation: {
        include: {
          patient: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          doctor: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getPrescriptionById(id: string) {
  return prisma.prescription.findUnique({
    where: {
      id,
    },
    include: {
      consultation: {
        include: {
          patient: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          doctor: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
