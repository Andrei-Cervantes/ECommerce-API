import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
dotenv.config();

import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
const port = 4002;

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

if (import.meta.url === new URL(import.meta.url).href) {
  app.listen(process.env.PORT || port, () => {
    console.log(`API is now online on port ${process.env.PORT || port}`);
  });
}

export default { app, mongoose };
