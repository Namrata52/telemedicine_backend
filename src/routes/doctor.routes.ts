import { Router } from "express";
import { Role } from "@prisma/client";

import {
  create,
  getAll,
  getOne,
  update,
  searchDoctorsController,
} from "../controllers/doctor.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createDoctorSchema,
  searchDoctorSchema,
} from "../validators/doctor.validation.js";


const router = Router();

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Create a doctor profile
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - specialization
 *               - experience
 *               - qualification
 *               - consultationFee
 *             properties:
 *               specialization:
 *                 type: string
 *                 example: Dermatology
 *               experience:
 *                 type: integer
 *                 example: 8
 *               qualification:
 *                 type: string
 *                 example: MBBS, MD Dermatology
 *               consultationFee:
 *                 type: number
 *                 example: 800
 *     responses:
 *       201:
 *         description: Doctor profile created successfully
 *       401:
 *         description: Unauthorized
 */

router.post(
    "/",
    authenticate,
    authorize(Role.DOCTOR),
    validate(createDoctorSchema),
    create
);

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     tags:
 *       - Doctor
 *     responses:
 *       200:
 *         description: List of all doctors
 */
router.get("/", 
  validate(searchDoctorSchema, "query"), 
  searchDoctorsController);

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     tags:
 *       - Doctor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Doctor fetched successfully
 *       404:
 *         description: Doctor not found
 */
router.get("/:id", getOne);

/**
 * @swagger
 * /doctors:
 *   put:
 *     summary: Update logged-in doctor's profile
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization:
 *                 type: string
 *                 example: Dermatology
 *               experience:
 *                 type: integer
 *                 example: 10
 *               qualification:
 *                 type: string
 *                 example: MBBS, MD Dermatology
 *               consultationFee:
 *                 type: number
 *                 example: 1300
 *     responses:
 *       200:
 *         description: Doctor profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Doctor not found
 */
router.put(
  "/",
  authenticate,
  authorize(Role.DOCTOR),
  update
);
export default router;