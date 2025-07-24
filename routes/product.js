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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product created successfully
 *       409:
 *         description: Duplicate product found
 *       500:
 *         description: Server error
 */
router.post("/", verify, verifyAdmin, createProduct);

/**
 *
 * @swagger
 * /products/all:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All products retrieved successfully
 *       404:
 *         description: No products found
 *       500:
 *         description: Server error
 */
router.get("/all", verify, verifyAdmin, getAllProducts);

/**
 *
 * @swagger
 * /products:
 *   get:
 *     summary: Get all active products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: All active products retrieved successfully
 *       404:
 *         description: No active products found
 *       500:
 *         description: Server error
 */
router.get("/", getAllActiveProducts);

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get a single product
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/:productId", getProduct);

/**
 *
 * @swagger
 * /products/{productId}/update:
 *   patch:
 *     summary: Update product information
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.patch("/:productId/update", verify, verifyAdmin, updateProduct);

/**
 *
 * @swagger
 * /products/{productId}/archive:
 *   patch:
 *     summary: Archive product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product archived successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.patch("/:productId/archive", verify, verifyAdmin, archiveProduct);

/**
 *
 * @swagger
 * /products/{productId}/activate:
 *   patch:
 *     summary: Activate product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product activated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.patch("/:productId/activate", verify, verifyAdmin, activateProduct);

/**
 *
 * @swagger
 * /products/searchByName:
 *   post:
 *     summary: Search products by name
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Products found successfully
 *       404:
 *         description: No products found
 *       500:
 *         description: Server error
 */
router.post("/searchByName", searchByName);

/**
 *
 * @swagger
 * /products/searchByPrice:
 *   post:
 *     summary: Search products by price range
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Products found successfully
 *       404:
 *         description: No products found
 *       500:
 *         description: Server error
 */
router.post("/searchByPrice", searchByPrice);

export default router;
