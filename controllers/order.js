import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// Helpers

const isAdmin = (req) => req.user?.isAdmin;

const adminGuard = (res) =>
  res.status(403).json({ error: "Forbidden: admin access required" });

// Controller

const orderController = () => {
  // POST /orders/checkout
  const checkout = async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user.id });

      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      if (cart.cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      const order = await Order.create({
        userId: req.user.id,
        productsOrdered: cart.cartItems,
        totalPrice: cart.totalPrice,
      });

      cart.cartItems = [];
      cart.totalPrice = 0;
      await cart.save();

      return res
        .status(201)
        .json({ message: "Order created successfully", order });
    } catch (err) {
      console.error("[checkout]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // GET /orders/my-orders
  const getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.user.id });
      return res.status(200).json(orders);
    } catch (err) {
      console.error("[getUserOrders]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // GET /orders
  const getAllOrders = async (req, res) => {
    if (!isAdmin(req)) return adminGuard(res);

    try {
      const orders = await Order.find();
      return res.status(200).json(orders);
    } catch (err) {
      console.error("[getAllOrders]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  return { checkout, getUserOrders, getAllOrders };
};

export default orderController;
