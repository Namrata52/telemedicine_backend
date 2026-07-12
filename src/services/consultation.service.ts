import prisma from "../config/prisma.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { logger } from "../utils/logger.js";

interface CreateConsultationInput {
  patientId: string;
  doctorId: string;
  availabilitySlotId: string;
  notes?: string;
  idempotencyKey?: string;
}

export async function createConsultation(data: CreateConsultationInput) {

  return prisma.$transaction(async (tx) => {
    if (data.idempotencyKey) {
      const existingKey = await tx.idempotencyKey.findUnique({
        where: {
          key: data.idempotencyKey,
        },
      });
    }
    const slot = await tx.availabilitySlot.findUnique({
      where: {
        id: data.availabilitySlotId,
      },
    });

    if (!slot) throw new NotFoundError("Slot not found");

    if (slot.isBooked) throw new BadRequestError("Slot already booked");

    const consultation = await tx.consultation.create({
      data: {
        patient: {
          connect: {
            id: data.patientId,
          },
        },

        doctor: {
          connect: {
            id: data.doctorId,
          },
        },
        availabilitySlot: {
          connect: {
            id: slot.id,
          },
        },
        notes: data.notes ?? null,
      },
      include: {
        patient: {
          select: {
            id: true,
            email: true,
            role: true,
            isVerified: true,
            profile: true,
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                profile: true,
              },
            },
          },
        },
        availabilitySlot: true,
      },
    });
    if (data.idempotencyKey) {
      await tx.idempotencyKey.create({
        data: {
          key: data.idempotencyKey,
          endpoint: "/consultations",
          requestHash: JSON.stringify({
            patientId: data.patientId,
            doctorId: data.doctorId,
            availabilitySlotId: data.availabilitySlotId,
          }),
          responseId: consultation.id,
        },
      });
    }
    console.log("Consultation created:", consultation);
    await tx.availabilitySlot.update({
      where: {
        id: slot.id,
      },
      data: {
        isBooked: true,
      },
    });
    logger.info({
      doctorId: consultation.doctorId,
      patientId: consultation.patientId,
      slotId: consultation.availabilitySlotId,
      action: "BOOK_CONSULTATION",
    });
    await tx.auditLog.create({
      data: {
        userId: data.patientId,
        action: "BOOK_CONSULTATION",
        entity: "Consultation",
        entityId: consultation.id,
      },
    });
    return consultation;
  });
}
export async function getConsultations() {
  return prisma.consultation.findMany({
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
      availabilitySlot: true,
      prescription: true,
      payment: true,
    },
  });
}

export async function getConsultationById(id: string) {
  return prisma.consultation.findUnique({
    where: {
      id,
    },
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
              email: true,
              role: true,
            },
          },
        },
      },
      availabilitySlot: true,
      prescription: true,
      payment: true,
    },
  });
}
