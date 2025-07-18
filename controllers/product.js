import Product from "../models/Product.js";

const productController = () => {
  // Controller for creating product (admin only)
  const createProduct = async (req, res) => {
    // const { name, description, price } = req.body;

    try {
      if (!req.user.isAdmin) {
        return res.status(403).send({ error: "Admin access only." });
      }

      const duplicateProduct = await Product.findOne({ name: req.body.name });
      if (duplicateProduct) {
        return res.status(409).send({
          error: "Duplicate Product Found",
          duplicateProduct: duplicateProduct,
        });
      }

      const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      });

      const createdProduct = await newProduct.save();
      return res.status(201).send({
        message: "Product created successfully",
        createdProduct: createdProduct,
      });
    } catch (error) {
      console.error("Error in creating a product: ", error);
      return res.status(500).send({ error: "Failed to create product" });
    }
  };

  // Controller for retrieving all products (admin only)
  const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
      if (products.length === 0) {
        return res.status(404).send({ message: "No products found" });
      }
      res.send(products);
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  };

  // Controller for retrieving single product
  const getProduct = async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send({ error: "Product not found" });
      }
      res.send(product);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  };

  // Controller for retrieving all active products
  const getAllActiveProducts = async (req, res) => {
    try {
      const activeProducts = await Product.find({ isActive: true });
      if (activeProducts.length === 0) {
        return res.status(404).send({ message: "No products found" });
      }
      res.send(activeProducts);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  };

  // Controller for updating product information (admin only)
  const updateProduct = (req, res) => {
    const { name, description, price } = req.body;

    if (req.user.isAdmin) {
      return Product.findByIdAndUpdate(req.params.productId, {
        name: name,
        description: description,
        price: price,
      })
        .then((updatedProduct) => {
          if (updatedProduct) {
            res.status(200).send({
              message: "Product updated successfully",
              updatedProduct: updatedProduct,
            });
          } else {
            res.status(404).send({ error: "Product not found" });
          }
        })
        .catch((err) => {
          console.error("Error in updating a product:", err);
          return res
            .status(500)
            .send({ error: "Error in updating a product." });
        });
    } else {
      return res.status(403).send({ error: "Admin access only." });
    }
  };

  // Controller for archiving product (admin only)
  const archiveProduct = (req, res) => {
    if (req.user.isAdmin) {
      return Product.findByIdAndUpdate(req.params.productId, {
        isActive: false,
      })
        .then((archiveProduct) => {
          if (archiveProduct) {
            res.status(200).send({
              message: "Product archived successfully",
              archiveProduct: {
                name: archiveProduct.name,
                isActive: archiveProduct.isActive,
              },
            });
          } else {
            res.status(400).send({ error: "Product not found" });
          }
        })
        .catch((err) => {
          console.error("Error in archiving a product: ", err);
          return res.status(500).send({ error: "Failed to archive product" });
        });
    } else {
      return res.status(403).send({ error: "Admin access only." });
    }
  };

  // Controller for activating product (admin only)
  const activateProduct = (req, res) => {
    if (req.user.isAdmin) {
      return Product.findByIdAndUpdate(req.params.productId, { isActive: true })
        .then((activatedProduct) => {
          if (activatedProduct) {
            res.status(200).send({
              message: "Product activated successfully",
              activatedProduct: {
                name: activatedProduct.name,
                isActive: activatedProduct.isActive,
              },
            });
          } else {
            res.status(400).send({ error: "Product not found" });
          }
        })
        .catch((err) => {
          console.error("Error in activating a product: ", err);
          return res.status(500).send({ error: "Failed to activate product" });
        });
    } else {
      return res.status(403).send({ error: "Admin access only." });
    }
  };

  // Search Functionalities
  // Controller for searching products by their names
  const searchByName = async (req, res) => {
    try {
      const { productName } = req.body;

      // Use a regular expression to perform a case-insensitive search
      const products = await Product.find({
        name: { $regex: productName, $options: "i" },
      });

      if (products.length === 0) {
        return res.status(404).json({
          message: "No products found within the specified price range",
        });
      }

      res.json(products);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // Controller for searching products by price range
  const searchByPrice = async (req, res) => {
    const { minPrice, maxPrice } = req.body;

    try {
      // Validate input
      if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0) {
        return res.status(400).json({ error: "Invalid price range" });
      }

      if (minPrice > maxPrice) {
        return res.status(400).json({ error: "Min must be greater than Max" });
      }

      const products = await Product.find({
        price: { $gte: minPrice, $lte: maxPrice },
      });

      if (products.length === 0) {
        return res.status(404).json({
          message: "No products found within the specified price range",
        });
      }

      res.json(products);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  return {
    createProduct,
    getAllProducts,
    getProduct,
    getAllActiveProducts,
    updateProduct,
    archiveProduct,
    activateProduct,
    searchByName,
    searchByPrice,
  };
};

export default productController;
