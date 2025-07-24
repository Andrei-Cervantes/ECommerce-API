import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
dotenv.config();

import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
const port = 3007;

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("Now connected to MongoDB Atlas"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes grouping
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

// Swagger Documentation
const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "API Documentation", version: "1.0.0" },
    tags: [
      { name: "User", description: "User management endpoints" },
      { name: "Product", description: "Product management endpoints" },
      { name: "Order", description: "Order management endpoints" },
      { name: "Cart", description: "Cart management endpoints" },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

if (import.meta.url === new URL(import.meta.url).href) {
  app.listen(process.env.PORT || port, () => {
    console.log(`API is now online on port ${process.env.PORT || port}`);
  });
}

export default { app, mongoose };
