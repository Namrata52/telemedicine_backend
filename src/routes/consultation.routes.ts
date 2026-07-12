import { Router } from "express";
import {
  create,
  getAll,
  getOne,
} from "../controllers/consultation.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createConsultation } from "../services/consultation.service.js";
import {consultationSchema} from "../validators/consultation.validation.js";
const router = Router();

/**
 * @swagger
 * /consultations:
 *   post:
 *     summary: Book a consultation
 *     tags:
 *       - Consultation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Idempotency-Key
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique key to prevent duplicate booking requests
 *         example: booking-123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *               availabilitySlotId:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Consultation booked
 */
router.post(
  "/",
  authenticate,
  validate(consultationSchema),
  create
);

/**
 * @swagger
 * /consultations:
 *   get:
 *     summary: Get all consultations
 *     tags:
 *       - Consultation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of consultations fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", getAll);

router.get("/:id", getOne);

export default router;