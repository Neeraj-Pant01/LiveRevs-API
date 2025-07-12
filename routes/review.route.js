const { createRevController, getAreview, getAllReviews, updateReviewCont } = require("../controllers/review.controller");
const { addReviewLimiter } = require("../middlewares/limiter");
const { verifyToken } = require("../middlewares/verifyToken");

const router = require("express").Router();

/**
 * @swagger
 * /review/:
 *   post:
 *     summary: Create a new product review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productName, price, productImage, brandname, rating, review]
 *             properties:
 *               productName:
 *                 type: string
 *               price:
 *                 type: number
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               productImage:
 *                 type: string
 *               productImages:
 *                 type: array
 *                 items:
 *                   type: string
 *               brandname:
 *                 type: string
 *               specifications:
 *                 type: array
 *                 items:
 *                   type: object
 *               description:
 *                 type: string
 *               rating:
 *                 type: number
 *               review:
 *                 type: string
 *               hastags:
 *                 type: array
 *                 items:
 *                   type: string
 *               purchaseLink:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/',addReviewLimiter,verifyToken, createRevController)


/**
 * @swagger
 * /review/{id}:
 *   get:
 *     summary: Get a specific review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *       404:
 *         description: Review not found
 */

router.get('/:id',getAreview)


/**
 * @swagger
 * /review/:
 *   get:
 *     summary: Get paginated reviews with optional filters
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword for productName, description, review, or category
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *         description: Minimum rating filter
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand name
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, oldest]
 *         description: Sort by createdAt (default is latest)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated reviews fetched successfully
 *       400:
 *         description: Bad request
 */
router.get('/',getAllReviews)


/**
 * @swagger
 * /review/{id}:
 *   patch:
 *     summary: Update a review (only by owner or admin)
 *     tags: [Reviews, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 example: Updated Product Name
 *               review:
 *                 type: string
 *                 example: Updated review content goes here.
 *               productImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional updated product image
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Review updated successfully
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       403:
 *         description: Not authorized to update this review
 *       404:
 *         description: Review not found
 */
router.patch('/:id',addReviewLimiter, verifyToken, updateReviewCont)

module.exports = router;