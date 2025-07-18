import express from "express";
import productController from "../controllers/product.js";
import auth from "../auth.js";
const router = express.Router();

const { verify, verifyAdmin } = auth();
const {
  createProduct,
  getAllProducts,
  getAllActiveProducts,
  getProduct,
  updateProduct,
  archiveProduct,
  activateProduct,
  searchByName,
  searchByPrice,
} = productController();

// Route for creating product (admin only)
router.post("/", verify, verifyAdmin, createProduct);

// Route for retrieving all products (admin only)
router.get("/all", verify, verifyAdmin, getAllProducts);

// Route for retrieving all active products
router.get("/", getAllActiveProducts);

// Route for retrieving single product
router.get("/:productId", getProduct);

// Route for updating product information (admin only)
router.patch("/:productId/update", verify, verifyAdmin, updateProduct);

// Route for archiving product (admin only)
router.patch("/:productId/archive", verify, verifyAdmin, archiveProduct);

// Route for activating product (admin only)
router.patch("/:productId/activate", verify, verifyAdmin, activateProduct);

// Search Functionalities
// Route for searching products by their names
router.post("/searchByName", searchByName);

// Route for searching products by price range
router.post("/searchByPrice", searchByPrice);

export default router;
