import { Router } from "express";
import { login, register,me } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { Role } from "@prisma/client";
import { authorize } from "../middlewares/role.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validation.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";
const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: PATIENT
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  login
);


router.get(
  "/me",
  authenticate,
  me
);


// router.get(
//   "/doctor-test",
//   authenticate,
//   authorize(Role.DOCTOR),
//   (req, res) => {
//     res.json({
//       message: "Welcome Doctor",
//     });
//   }
// );

export default router;