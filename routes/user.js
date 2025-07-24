import express from "express";
import userController from "../controllers/user.js";
import auth from "../auth.js";
const router = express.Router();

const { verify, isLoggedIn, verifyAdmin } = auth();
const { registerUser, loginUser, updatePassword, setUserAsAdmin, getProfile } =
  userController();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
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
 *               - mobileNo
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               mobileNo:
 *                 type: string
 *                 example: 09012345678
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post("/", registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful login with access token
 *       400:
 *         description: Invalid email format
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: Email not found
 */

router.post("/login", loginUser);

/**
 * @swagger
 * /users/update-password:
 *   patch:
 *     summary: Update user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Password too short
 *       500:
 *         description: Server error
 */
router.patch("/update-password", verify, updatePassword);

/**
 * @swagger
 * /users/{userId}/set-as-admin:
 *   patch:
 *     summary: Set user as admin (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to set as admin
 *     responses:
 *       200:
 *         description: User updated to admin
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch("/:userId/set-as-admin", verify, verifyAdmin, setUserAsAdmin);

/**
 * @swagger
 * /users/details:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/details", verify, getProfile);

export default router;
