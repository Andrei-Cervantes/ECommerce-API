import express from "express";
import orderController from "../controllers/order.js";
import auth from "../auth.js";
const router = express.Router();

const { verify, verifyAdmin } = auth();
const { checkout, getUserOrders, getAllOrders } = orderController();

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     summary: Checkout a cart
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order created successfully
 *       404:
 *         description: Cart not found for current user
 *       409:
 *         description: CartItems is empty
 *       500:
 *         description: Server error
 */
router.post("/checkout", verify, checkout);

/**
 * @swagger
 * /orders/my-orders:
 *   get:
 *     summary: Get authenticated user's orders
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User orders retrieved successfully
 *       404:
 *         description: No orders found for the current user
 *       500:
 *         description: Server error
 */
router.get("/my-orders", verify, getUserOrders);

/**
 * @swagger
 * /orders/all-orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/all-orders", verify, verifyAdmin, getAllOrders);

export default router;
