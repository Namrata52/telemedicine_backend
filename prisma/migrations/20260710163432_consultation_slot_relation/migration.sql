/*
  Warnings:

  - You are about to drop the column `scheduledAt` on the `Consultation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[availabilitySlotId]` on the table `Consultation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `availabilitySlotId` to the `Consultation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Consultation" DROP COLUMN "scheduledAt",
ADD COLUMN     "availabilitySlotId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Consultation_availabilitySlotId_key" ON "public"."Consultation"("availabilitySlotId");

-- AddForeignKey
ALTER TABLE "public"."Consultation" ADD CONSTRAINT "Consultation_availabilitySlotId_fkey" FOREIGN KEY ("availabilitySlotId") REFERENCES "public"."AvailabilitySlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
