import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getMyProfile,updateMyProfile } from "../controllers/profile.controller.js";

const router = Router();

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authenticate,
  getMyProfile
);


/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update logged-in user's profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Rohan
 *               lastName:
 *                 type: string
 *                 example: Singh
 *               phone:
 *                 type: string
 *                 example: "9872392013"
 *               gender:
 *                 type: string
 *                 enum:
 *                   - MALE
 *                   - FEMALE
 *                   - OTHER
 *                 example: MALE
 *               address:
 *                 type: string
 *                 example: Mumbai
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/",
  authenticate,
  updateMyProfile
);

export default router;