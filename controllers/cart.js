const Cart = require("../models/Cart");
const Product = require("../models/Product");


// Start Code
// Controller for getting user's cart
module.exports.getUserCart = async (req, res) => {
    try {
        const userId = req.user.id; 
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        }

        res.send({
            message: "Cart found",
            cart: cart
        });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

// Controller for adding to cart
// - subtotal for each item
// - total price for all items
module.exports.addToCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // If no cart document with the current user's id can be found, create a new cart
            cart = new Cart({
                userId: userId,
                cartItems: [],
                totalPrice: 0
            });
        }

        for (const item of cartItems) {
            const { productId, quantity } = item;
            let product = await Product.findById({ _id: productId });

            if (product) {
                const existingCartItem = cart.cartItems.find(cartItem => cartItem.productId === productId);
                const subtotal = product.price * quantity;

                if (existingCartItem) {
                    // Product already in the cart, update quantity and subtotal
                    existingCartItem.quantity += quantity;
                    existingCartItem.subtotal += subtotal;
                } else {
                    // Product not in the cart, add to cart
                    cart.cartItems.push({
                        productId: productId,
                        quantity: quantity,
                        subtotal: subtotal
                    });
                }
            }
        }

        // Update the totalPrice value of the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);
        
        // Save the cart document
        await cart.save();

        res.send({ message: 'Products added to cart successfully', cart: cart });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}


// Controller for changing product quantities
module.exports.updateCartQuantity = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // If no cart document with the current user's id can be found, create a new cart
            cart = new Cart({
                userId: userId,
                cartItems: [],
                totalPrice: 0
            });
        }

        for (const item of cartItems) {
            const { productId, quantity } = item;
            let product = await Product.findById({ _id: productId });

            if (product) {
                const existingCartItem = cart.cartItems.find(cartItem => cartItem.productId === productId);
                const subtotal = product.price * quantity;

                if (existingCartItem) {
                    // Product already in the cart, update quantity and subtotal
                    existingCartItem.quantity = quantity;
                    existingCartItem.subtotal = subtotal;
                } else {
                    // Product not in the cart, add to cart
                    cart.cartItems.push({
                        productId: productId,
                        quantity: quantity,
                        subtotal: subtotal
                    });
                }
            }
        }

        // Update the totalPrice value of the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);
        
        // Save cart document
        await cart.save();

        res.send({ message: 'Products quantity updated in cart successfully', cart: cart });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

// Controller for removing products from cart
module.exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found for current user' });
        }

        const cartItemIndex = cart.cartItems.findIndex(item => item.productId === productId);

        if (cartItemIndex !== -1) {
            // Remove item
            cart.cartItems.splice(cartItemIndex, 1);

            // Update totalPrice
            cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

            // Save document
            await cart.save();

            return res.send({ 
                message: 'Product removed from cart successfully', 
                updatedCart: cart
            });
        } else {
            return res.status(404).send({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

// Controller for clearing cart
module.exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found for current user' });
        }

        if (cart.cartItems.length > 0) {
            cart.cartItems = [];
            cart.totalPrice = 0;

            await cart.save();
        
            return res.send({ 
                message: 'Cart cleared successfully', 
                updatedCart: cart
            });
        } else {
            return res.status(409).send({ message: "CartItems is empty"});
        }
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}