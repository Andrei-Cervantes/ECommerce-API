const express = require("express");
const orderController = require("../controllers/order");
const { verify, verifyAdmin } = require("../auth");
const router = express.Router();

// Route for non-admin user checkout (create order)
router.post("/checkout", verify, orderController.checkout);

// Route for retrieving authenticated user's orders
router.get("/my-orders", verify, orderController.getUserOrders);

// Route for retrieving all orders (admin only)
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

module.exports = router;