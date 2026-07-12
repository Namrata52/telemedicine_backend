import prisma from "../config/prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";

interface CreateSlotInput {
  doctorId: string;
  startTime: Date;
  endTime: Date;
}

export async function createAvailabilitySlot(data: CreateSlotInput) {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: data.doctorId,
    },
  });

  if (!doctor) throw new NotFoundError("Doctor not found");
  const availability = await prisma.availabilitySlot.create({
    data,
  });
  await prisma.auditLog.create({
    data: {
      userId: doctor.userId,
      action: "CREATE_AVAILABILITY_SLOT",
      entity: "AvailabilitySlot",
      entityId: availability.id,
    },
  });
  return availability;
}

export async function getDoctorSlots(doctorId: string) {
  return prisma.availabilitySlot.findMany({
    where: {
      doctorId,
      isBooked: false,
    },
    orderBy: {
      startTime: "asc",
    },
  });
}
