const express = require("express");
const productController = require("../controllers/product");
const { verify, verifyAdmin } = require("../auth");
const router = express.Router();

// Route for creating product (admin only)
router.post("/", verify, verifyAdmin, productController.createProduct);

// Route for retrieving all products (admin only)
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

// Route for retrieving all active products
router.get("/", productController.getAllActiveProducts);

// Route for retrieving single product
router.get("/:productId", productController.getProduct);

// Route for updating product information (admin only)
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

// Route for archiving product (admin only)
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// Route for activating product (admin only)
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Search Functionalities
// Route for searching products by their names
router.post("/searchByName", productController.searchByName);

// Route for searching products by price range
router.post("/searchByPrice", productController.searchByPrice);

module.exports = router;