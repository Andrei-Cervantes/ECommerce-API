const express = require("express");
const cartController = require("../controllers/cart");
const { verify } = require("../auth");
const router = express.Router();

// Route for getting user's cart
router.get("/get-cart", verify, cartController.getUserCart);

// Route for adding to cart
// - subtotal for each item
// - total price for all items
router.post("/add-to-cart", verify, cartController.addToCart);

// Route for changing product quantities
router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);

// Route for removing products from cart
router.patch("/:productId/remove-from-cart", verify, cartController.removeFromCart);

// Route for clearing cart
router.put("/clear-cart", verify, cartController.clearCart);

module.exports = router;