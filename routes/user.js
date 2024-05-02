const express = require("express");
const userController = require("../controllers/user");
const { verify, isLoggedIn, verifyAdmin } = require("../auth");
const router = express.Router();

// Route for user registration
router.post("/", userController.registerUser);

// Route for user authentication
router.post("/login", userController.loginUser);

// Route for updating password
router.patch("/update-password", verify, userController.updatePassword);

// Set User as admin (Admin Only)
router.patch("/:userId/set-as-admin", verify, verifyAdmin, userController.setUserAsAdmin);

// Retrieve User Details
router.get("/details", verify, userController.getProfile);

module.exports = router;