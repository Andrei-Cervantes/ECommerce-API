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

// Route for getting user's cart
router.get("/get-cart", verify, getUserCart);

// Route for adding to cart
// - subtotal for each item
// - total price for all items
router.post("/add-to-cart", verify, addToCart);

// Route for changing product quantities
router.patch("/update-cart-quantity", verify, updateCartQuantity);

// Route for removing products from cart
router.patch("/:productId/remove-from-cart", verify, removeFromCart);

// Route for clearing cart
router.put("/clear-cart", verify, clearCart);

export default router;
