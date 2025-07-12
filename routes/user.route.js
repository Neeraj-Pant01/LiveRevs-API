const { updateUserCont, frogotPassController, disableAccount, deleteUserCont, getSingleUserController, getAllUsersController, followUserController, unfollowUserCOntroller } = require("../controllers/user.controller");
const { authLimiter } = require("../middlewares/limiter");
const { verifyToken } = require("../middlewares/verifyToken");

const router = require("express").Router();

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a single user's details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:id', authLimiter, verifyToken, getSingleUserController);




/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: "Search by name or email (partial match)"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Page number for pagination (default: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Number of users per page (default: 10)"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, oldest]
 *         description: "Sort users by creation date"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [disabled]
 *         description: "Filter to show only disabled users"
 *       - in: query
 *         name: verified
 *         schema:
 *           type: string
 *           enum: [true]
 *         description: "Filter to show only verified users"
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           enum: [google]
 *         description: "Filter to show users registered via Google"
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       fullName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       fromGoogle:
 *                         type: boolean
 *                       isVerified:
 *                         type: boolean
 *                       isadmin:
 *                         type: boolean
 *                       disabled:
 *                         type: boolean
 *                 totalDocs:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Unauthorized - missing or invalid token
 */

router.get('/', authLimiter, verifyToken, getAllUsersController);




/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch('/:id', authLimiter, verifyToken, updateUserCont)


/**
 * @swagger
 * /user/forgot-password/{id}:
 *   patch:
 *     summary: forgot password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: password updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch('/forgot-password/:id', authLimiter, verifyToken, frogotPassController)



/**
 * @swagger
 * /user/disable/{id}:
 *   patch:
 *     summary: disable account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: user disabled successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch('/disable/:id/', authLimiter, verifyToken, disableAccount)


/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Permanently delete a user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete('/:id', authLimiter, verifyToken, deleteUserCont)

/**
 * @swagger
 * /user/follow/{id}:
 *   patch:
 *     summary: follow a user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to follow
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User followed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch('/follow/:id', authLimiter, verifyToken, followUserController)


/**
 * @swagger
 * /user/unfollow/{id}:
 *   patch:
 *     summary: unfollow a user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to follow
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch('/unfollow/:id', authLimiter, verifyToken, unfollowUserCOntroller)


module.exports = router;