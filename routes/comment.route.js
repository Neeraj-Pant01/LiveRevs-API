const { addCommentController, updateCommentController, deleteCommentController, likeDislikeCommentController, getRepliesForCommentCont } = require("../controllers/commentController");
const { commentLimiter } = require("../middlewares/limiter");
const { verifyToken } = require("../middlewares/verifyToken");
const { getTopLevelComments } = require("../services/comment.service");
const router = require("express").Router();

/**
 * @swagger
 * /comments/{id}:
 *   post:
 *     summary: Add a new comment or reply to a review
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reviewId
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: "This is a review comment."
 *               userName:
 *                 type: string
 *                 example: "John Doe"
 *               parent:
 *                 type: string
 *                 example: 665c9a5bda2123... # Optional for replies
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 */
router.post('/:id',commentLimiter, verifyToken, addCommentController)


/**
 * @swagger
 * /comments/comment/{id}:
 *   patch:
 *     summary: Update your comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Updated comment text"
 *     responses:
 *       200:
 *         description: Comment updated
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
router.patch('/comment/:id', commentLimiter, verifyToken, updateCommentController)


/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete your comment (or admin override)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
router.delete('/:id',verifyToken, commentLimiter, deleteCommentController);


/**
 * @swagger
 * /comments/{id}/like:
 *   patch:
 *     summary: Like or unlike a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to like/unlike
 *     responses:
 *       200:
 *         description: Like toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Liked"  # or "Unliked"
 *                 likes:
 *                   type: number
 *                   example: 15
 *       404:
 *         description: Comment not found
 */
router.patch('/:id/like', verifyToken, likeDislikeCommentController)



/**
 * @swagger
 * /review/{reviewId}:
 *   get:
 *     summary: Get top-level comments for a review (paginated)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of comments per page (default is 10)
 *     responses:
 *       200:
 *         description: Paginated list of parent comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDocs:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 */
router.get('/review/:reviewId',commentLimiter,getTopLevelComments)


/**
 * @swagger
 * /replies/{parentId}:
 *   get:
 *     summary: Get replies to a specific comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the parent comment
 *     responses:
 *       200:
 *         description: Replies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get('/replies/:parentId', commentLimiter, getRepliesForCommentCont)


module.exports = router;