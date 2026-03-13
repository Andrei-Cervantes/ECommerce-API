import Product from "../models/Product.js";

// Helpers

const isAdmin = (req) => req.user?.isAdmin;

const adminGuard = (res) => {
  res.status(403).json({ error: "Forbidden: admin access required" });
};

// Controller

const productController = () => {
  // POST /products
  const createProduct = async (req, res) => {
    if (!isAdmin(req)) return adminGuard(res);

    const { name, description, price } = req.body;

    if (!name || !description || price == null) {
      return res
        .status(400)
        .json({ error: "name, description, and price are required" });
    }

    if (typeof price !== "number" || price < 0) {
      return res
        .status(400)
        .json({ error: "price must be a non-negative number" });
    }

    try {
      const existing = await Product.findOne({ name });
      if (existing) {
        return res
          .status(409)
          .json({ error: "A product with that name already exists" });
      }

      const product = await Product.create({ name, description, price });
      return res
        .status(201)
        .json({ message: "Product created successfully", product });
    } catch (err) {
      console.error("[createProduct]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // GET /products/all
  const getAllProducts = async (req, res) => {
    if (!isAdmin(req)) return adminGuard(res);

    try {
      const products = await Product.find();
      return res.status(200).json(products);
    } catch (err) {
      console.error("[getAllProducts]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // GET /products/:productId
  const getProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.status(200).json(product);
    } catch (err) {
      console.error("[getProduct]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // GET /products
  const getAllActiveProducts = async (req, res) => {
    try {
      const products = await Product.find({ isActive: true });
      return res.status(200).json(products);
    } catch (err) {
      console.error("[getAllActiveProducts]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // PATCH /products/:productId
  const updateProduct = async (req, res) => {
    if (!isAdmin(req)) return adminGuard(res);

    const { name, description, price } = req.body;

    if (price != null && (typeof price !== "number" || price < 0)) {
      return res
        .status(400)
        .json({ error: "price must be a non-negative number" });
    }

    try {
      const product = await Product.findByIdAndUpdate(
        req.params.productId,
        {
          ...(name && { name }),
          ...(description && { description }),
          ...(price != null && { price }),
        },
        { new: true, runValidators: true },
      );

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res
        .status(200)
        .json({ message: "Product updated successfully", product });
    } catch (err) {
      console.error("[updateProduct]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // PATCH /products/:productId/archive
  const archiveProduct = async (req, res) => {
    if (!isAdmin(req)) return adminGuard(res);

    try {
      const product = await Product.findByIdAndUpdate(
        req.params.productId,
        { isActive: false },
        { new: true },
      );

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res
        .status(200)
        .json({ message: "Product archived successfully", product });
    } catch (err) {
      console.error("[archiveProduct]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // PATCH /products/:productId/activate
  const activateProduct = async (req, res) => {
    if (!isAdmin(req)) return adminGuard(res);

    try {
      const product = await Product.findByIdAndUpdate(
        req.params.productId,
        { isActive: true },
        { new: true },
      );

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res
        .status(200)
        .json({ message: "Product activated successfully", product });
    } catch (err) {
      console.error("[activateProduct]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // GET /products/search?productName=...
  const searchByName = async (req, res) => {
    const { productName } = req.query;

    if (!productName || !productName.trim()) {
      return res
        .status(400)
        .json({ error: "productName query parameter is required" });
    }

    try {
      const products = await Product.find({
        name: { $regex: productName.trim(), $options: "i" },
      });

      return res.status(200).json(products);
    } catch (err) {
      console.error("[searchByName]", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  // GET /products/search?minPrice=...&maxPrice=...
  const searchByPrice = async (req, res) => {
    const min = parseFloat(req.query.minPrice);
    const max = parseFloat(req.query.maxPrice);

    if (isNaN(min) || isNaN(max)) {
      return res
        .status(400)
        .json({ error: "minPrice and maxPrice must be valid numbers" });
    }

    if (min < 0 || max < 0) {
      return res.status(400).json({ error: "Prices must be non-negative" });
    }

    if (min > max) {
      return res
        .status(400)
        .json({ error: "minPrice must not exceed maxPrice" });
    }

    try {
      const products = await Product.find({ price: { $gte: min, $lte: max } });
      return res.status(200).json(products);
    } catch (err) {
      console.error("[searchByPrice]", err);
      return res.status(500).json({ error: "Internal server error" });
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
