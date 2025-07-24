import express from "express";
import cartController from "../controllers/cart.js";
import auth from "../auth.js";
const router = express.Router();

const { verify } = auth();
const {
  getUserCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} = cartController();

/**
 * @swagger
 * /cart/get-cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router.get("/get-cart", verify, getUserCart);

/**
 * @swagger
 * /cart/add-to-cart:
 *   post:
 *     summary: Add to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post("/add-to-cart", verify, addToCart);

/**
 * @swagger
 * /cart/update-cart-quantity:
 *   patch:
 *     summary: Update cart quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart quantity updated successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router.patch("/update-cart-quantity", verify, updateCartQuantity);

/**
 * @swagger
 * /cart/{productId}/remove-from-cart:
 *   patch:
 *     summary: Remove product from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router.patch("/:productId/remove-from-cart", verify, removeFromCart);

/**
 * @swagger
 * /cart/clear-cart:
 *   put:
 *     summary: Clear cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router.put("/clear-cart", verify, clearCart);

export default router;
