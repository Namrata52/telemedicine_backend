import prisma from "../config/prisma.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { logger } from "../utils/logger.js";

interface CreatePaymentInput {
  consultationId: string;
  amount: number;
  transactionId?: string;
  idempotencyKey: string;
}

export async function createPayment(data: CreatePaymentInput) {
  return await prisma.$transaction(async (tx) => {
    const consultation = await tx.consultation.findUnique({
      where: {
        id: data.consultationId,
      },
      include: {
        payment: true,
        doctor: {
          select: {
            consultationFee: true,
          },
        },
      },
    });

     const existingKey = await tx.idempotencyKey.findUnique({
       where: {
         key: data.idempotencyKey,
       },
     });

     if (existingKey?.responseId) {
       const payment = await tx.payment.findUnique({
         where: {
           id: existingKey.responseId,
         },
         include: {
           consultation: true,
         },
       });

       if (payment) {
         return {
           payment,
           created: false,
         };
       }
     }

    if (!consultation) throw new NotFoundError("Consultation not found");

    if (consultation.payment)
      throw new BadRequestError("Payment already exists");
    if (data.amount !== consultation.doctor.consultationFee) {
      throw new BadRequestError(
        `Invalid payment amount. Expected ₹${consultation.doctor.consultationFee}`,
      );
    }
   
    const payment = await tx.payment.create({
      data: {
        consultation: {
          connect: {
            id: data.consultationId,
          },
        },
        amount: data.amount,
        transactionId: data.transactionId ?? null,
        status: "SUCCESS",
      },
      include: {
        consultation: true,
      },
    });
    await tx.idempotencyKey.create({
      data: {
        key: data.idempotencyKey,
        endpoint: "/payments",
        requestHash: data.consultationId,
        responseId: payment.id,
      },
    });
    logger.info(
      {
        paymentId: payment.id,
        consultationId: payment.consultationId,
        patientId: consultation.patientId,
        amount: payment.amount,
        status: payment.status,
      },
      "Payment created successfully",
    );

    await tx.auditLog.create({
      data: {
        userId: consultation.patientId,
        action: "PAYMENT_SUCCESS",
        entity: "Payment",
        entityId: payment.id,
      },
    });
    return {
      payment,
      created: true,
    };
  });
}

export async function getPayments() {
  return prisma.payment.findMany({
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

export async function getPaymentById(id: string) {
  return prisma.payment.findUnique({
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
