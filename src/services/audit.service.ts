import prisma from "../config/prisma.js";

interface CreateAuditLogInput {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
}

export async function createAuditLog(data: CreateAuditLogInput) {
  return prisma.auditLog.create({
    data,
  });
}

export async function getAuditLogs() {
  return prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
          profile:true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
