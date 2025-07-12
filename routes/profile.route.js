const { getProfileCont, createProfileCont, updateProfileCont, deleteProfileCont, addSocialLinksCont, addAffiliateLinkCont } = require("../controllers/profile.controller");
const { profileViewLimiter } = require("../middlewares/limiter");
const { verifyToken } = require("../middlewares/verifyToken");

const router = require("express").Router();

/**
 * @swagger
 * /profile/{userId}:
 *   get:
 *     summary: Get the profile of a specific user
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       404:
 *         description: Profile not found
 */
router.get('/:id',profileViewLimiter,verifyToken,getProfileCont)


/**
 * @swagger
 * /profile/create:
 *   post:
 *     summary: Create a profile for a user
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bio]
 *             properties:
 *               bio:
 *                 type: string
 *               profilePic:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/create',profileViewLimiter,verifyToken,createProfileCont)


/**
 * @swagger
 * /profile/update:
 *   patch:
 *     summary: Update profile data
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               profilePic:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: Profile not found
 */
router.patch('/update',profileViewLimiter,verifyToken,updateProfileCont)



/**
 * @swagger
 * /profile/{profileId}:
 *   delete:
 *     summary: Permanently delete a user profile (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the profile
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Profile not found
 */
router.delete('/:id',profileViewLimiter,verifyToken,deleteProfileCont)



/**
 * @swagger
 * /profile/social:
 *   patch:
 *     summary: Add social links to a profile
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               socialLinks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     platform:
 *                       type: string
 *                     link:
 *                       type: string
 *     responses:
 *       200:
 *         description: Social links added
 */
router.patch('/social',profileViewLimiter,verifyToken,addSocialLinksCont)



/**
 * @swagger
 * /profile/affiliate:
 *   patch:
 *     summary: Add affiliate links to a profile
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               affiliateLinks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productName:
 *                       type: string
 *                     productLink:
 *                       type: string
 *     responses:
 *       200:
 *         description: Affiliate links added
 */router.patch('/affiliate',profileViewLimiter,verifyToken,addAffiliateLinkCont)




module.exports = router;
