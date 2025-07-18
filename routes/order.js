import express from "express";
import orderController from "../controllers/order.js";
import auth from "../auth.js";
const router = express.Router();

const { verify, verifyAdmin } = auth();
const { checkout, getUserOrders, getAllOrders } = orderController();

// Route for non-admin user checkout (create order)
router.post("/checkout", verify, checkout);

// Route for retrieving authenticated user's orders
router.get("/my-orders", verify, getUserOrders);

// Route for retrieving all orders (admin only)
router.get("/all-orders", verify, verifyAdmin, getAllOrders);

export default router;
