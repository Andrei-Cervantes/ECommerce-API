import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

const orderController = () => {
  // Controller for non-admin user checkout (create order)
  const checkout = async (req, res) => {
    try {
      const userId = req.user.id;

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        return res
          .status(404)
          .send({ message: "Cart not found for current user" });
      }

      if (cart.cartItems.length > 0) {
        // Create a new Order document
        let newOrder = new Order({
          userId: userId,
          productsOrdered: cart.cartItems,
          totalPrice: cart.totalPrice,
        });

        await newOrder.save();

        cart.cartItems = [];
        cart.totalPrice = 0;

        await cart.save();

        return res.send({
          message: "Order created successfully",
          order: newOrder,
          updatedCart: cart,
        });
      } else {
        return res.status(409).send({ message: "CartItems is empty" });
      }
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  };

  // Controller for retrieving authenticated user's orders
  const getUserOrders = async (req, res) => {
    try {
      const userId = req.user.id;

      const orders = await Order.find({ userId });

      if (orders.length > 0) {
        return res.send({
          message: "User orders retrieved successfully",
          orders: orders,
        });
      } else {
        return res
          .status(404)
          .send({ message: "No orders found for the current user" });
      }
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  };

  // Controller for retrieving all orders (admin only)
  const getAllOrders = async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).send({
          message: "Forbidden: You are not authorized to access this resource",
        });
      }

      const allOrders = await Order.find();

      if (allOrders.length > 0) {
        return res.send({
          message: "All orders retrieved successfully",
          orders: allOrders,
        });
      } else {
        return res.status(404).send({ message: "No orders found" });
      }
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  };

  return { checkout, getUserOrders, getAllOrders };
};

export default orderController;
