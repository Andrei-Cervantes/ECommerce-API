const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const port = 4002;

const app = express();

// MongoDB Connection
mongoose.connect("mongodb+srv://admin:admin123@b402-course-booking.kzbsa05.mongodb.net/ecommerce-api?retryWrites=true&w=majority&appName=b402-course-booking");

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("Now connected to MongoDB Atlas"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes grouping
app.use("/b2/users", userRoutes);
app.use("/b2/orders", orderRoutes);
app.use("/b2/products", productRoutes);
app.use("/b2/cart", cartRoutes);


if(require.main === module) {
	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on port ${ process.env.PORT || port}`);
	})
}

module.exports = {app, mongoose};