import { Router } from "express";
import {
  createSlot,
  getSlots,
} from "../controllers/availability.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { availabilitySchema } from "../validators/availablity.validation.js";
import { Role } from "@prisma/client";

const router = Router();

/**
 * @swagger
 * /availability:
 *   post:
 *     summary: Create an availability slot
 *     tags:
 *       - Availability
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - startTime
 *               - endTime
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: cmrgb5g020000ul40e3rg2ljl
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-07-16T15:00:00.000Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-07-16T15:30:00.000Z"
 *     responses:
 *       201:
 *         description: Availability slot created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  authorize(Role.DOCTOR),
  validate(availabilitySchema),
  createSlot,
);

/**
 * @swagger
 * /availability/{doctorId}:
 *   get:
 *     summary: Get an availability slot by ID
 *     tags:
 *       - Availability
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Availability Slot ID
 *     responses:
 *       200:
 *         description: Availability slot fetched successfully
 *       404:
 *         description: Availability slot not found
 */


router.get("/:doctorId", getSlots);

export default router;
