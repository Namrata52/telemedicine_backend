import { Router } from "express";
import {
  create,
  getAll,
  getOne,
} from "../controllers/payment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { paymentSchema } from "../validators/payment.validation.js";
import { paymentLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a payment for a consultation
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Idempotency-Key
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique key to prevent duplicate payment requests
 *         example: payment-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consultationId
 *               - amount
 *             properties:
 *               consultationId:
 *                 type: string
 *                 example: cmrhi80060004uluclx1gxicg
 *               amount:
 *                 type: number
 *                 example: 1300
 *               transactionId:
 *                 type: string
 *                 example: TXN124567829
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Duplicate request (Idempotency-Key already used)
 */
router.post(
  "/",
  paymentLimiter,
  authenticate,
  validate(paymentSchema),
  create,
);


/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     tags:
 *       - Payment
 *     responses:
 *       200:
 *         description: List of all payments fetched successfully
 */
router.get("/", getAll);


/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags:
 *       - Payment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment fetched successfully
 *       404:
 *         description: Payment not found
 */
router.get("/:id", getOne);

export default router;