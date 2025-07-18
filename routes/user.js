import express from "express";
import userController from "../controllers/user.js";
import auth from "../auth.js";
const router = express.Router();

const { verify, isLoggedIn, verifyAdmin } = auth();
const { registerUser, loginUser, updatePassword, setUserAsAdmin, getProfile } =
  userController();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 * /users:
 *   post:
 *     summary: Register a new user
 */

// Route for user registration
router.post("/", registerUser);

// Route for user authentication
router.post("/login", loginUser);

// Route for updating password
router.patch("/update-password", verify, updatePassword);

// Set User as admin (Admin Only)
router.patch("/:userId/set-as-admin", verify, verifyAdmin, setUserAsAdmin);

// Retrieve User Details
router.get("/details", verify, getProfile);

export default router;
