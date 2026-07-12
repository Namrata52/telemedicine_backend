import { Router } from "express";
import {
  create,
  getAll,
  getOne,
} from "../controllers/prescription.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { Role } from "@prisma/client";

const router = Router();

/**
 * @swagger
 * /prescriptions:
 *   post:
 *     summary: Create a prescription
 *     tags:
 *       - Prescription
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consultationId
 *               - medicines
 *               - instructions
 *             properties:
 *               consultationId:
 *                 type: string
 *                 example: cmrhi80060004uluclx1gxicg
 *               medicines:
 *                 type: string
 *                 example: No medicines required
 *               instructions:
 *                 type: string
 *                 example: Exercise more for improving hbps.
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  authorize(Role.DOCTOR),
  create
);


/**
 * @swagger
 * /prescriptions:
 *   get:
 *     summary: Get all prescriptions
 *     tags:
 *       - Prescription
 *     responses:
 *       200:
 *         description: List of prescriptions fetched successfully
 */
router.get("/", getAll);


/**
 * @swagger
 * /prescriptions/{id}:
 *   get:
 *     summary: Get a prescription by ID
 *     tags:
 *       - Prescription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prescription ID
 *     responses:
 *       200:
 *         description: Prescription fetched successfully
 *       404:
 *         description: Prescription not found
 */
router.get("/:id", getOne);

export default router;