import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Helpers

// Recalculates the cart's totalPrice from its items.
const recalcTotal = (cart) => {
  cart.totalPrice = cart.cartItems.reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );
};

// Finds or initializes a cart for the given user (does not save).
const findOrInitCart = async (userId) => {
  return (
    (await Cart.findOne({ userId })) ??
    new Cart({ userId, cartItems: [], totalPrice: 0 })
  );
};

// Controller

const cartController = () => {
  // GET /cart
  const getUserCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      return res.status(200).json(cart);
    } catch (err) {
      console.error("[getUserCart]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // POST /cart
  const addToCart = async (req, res) => {
    const { cartItems } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res
        .status(400)
        .json({ error: "cartItems must be a non-empty array" });
    }

    try {
      const cart = await findOrInitCart(req.user.id);

      for (const { productId, quantity } of cartItems) {
        if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
          return res
            .status(400)
            .json({
              error:
                "Each item requires a valid productId and a positive integer quantity",
            });
        }

        const product = await Product.findById(productId);
        if (!product) continue; // skip unknown products silently

        const existing = cart.cartItems.find(
          (i) => String(i.productId) === String(productId),
        );

        if (existing) {
          existing.quantity += quantity;
          existing.subtotal += product.price * quantity;
        } else {
          cart.cartItems.push({
            productId,
            quantity,
            subtotal: product.price * quantity,
          });
        }
      }

      recalcTotal(cart);
      await cart.save();

      return res
        .status(200)
        .json({ message: "Items added to cart successfully", cart });
    } catch (err) {
      console.error("[addToCart]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // PUT /cart
  const updateCartQuantity = async (req, res) => {
    const { cartItems } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res
        .status(400)
        .json({ error: "cartItems must be a non-empty array" });
    }

    try {
      const cart = await findOrInitCart(req.user.id);

      for (const { productId, quantity } of cartItems) {
        if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
          return res
            .status(400)
            .json({
              error:
                "Each item requires a valid productId and a positive integer quantity",
            });
        }

        const product = await Product.findById(productId);
        if (!product) continue;

        const existing = cart.cartItems.find(
          (i) => String(i.productId) === String(productId),
        );

        if (existing) {
          existing.quantity = quantity;
          existing.subtotal = product.price * quantity;
        } else {
          cart.cartItems.push({
            productId,
            quantity,
            subtotal: product.price * quantity,
          });
        }
      }

      recalcTotal(cart);
      await cart.save();

      return res
        .status(200)
        .json({ message: "Cart updated successfully", cart });
    } catch (err) {
      console.error("[updateCartQuantity]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // DELETE /cart/:productId
  const removeFromCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const index = cart.cartItems.findIndex(
        (item) => String(item.productId) === String(req.params.productId),
      );

      if (index === -1) {
        return res.status(404).json({ error: "Product not found in cart" });
      }

      cart.cartItems.splice(index, 1);
      recalcTotal(cart);
      await cart.save();

      return res.status(200).json({ message: "Item removed from cart", cart });
    } catch (err) {
      console.error("[removeFromCart]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // DELETE /cart
  const clearCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      cart.cartItems = [];
      cart.totalPrice = 0;
      await cart.save();

      return res.status(200).json({ message: "Cart cleared successfully" });
    } catch (err) {
      console.error("[clearCart]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  return {
    getUserCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  };
};

export default cartController;
