const { createProfile, updateProfile, getProfile, addSocialLinks, addAffiliateLinks, deleteProfile } = require("../services/profile.service")
const createError = require("../utils/error")


exports.createProfileCont = async (req, res, next) => {
    try {
        if (!req.user.userId) return next(createError('login to create profile', 403))

        const profile = await createProfile(req.user.userId, req.body)
        if (!profile) return next(createError('profile not created !', 404))

        res.status(200).json(profile)
    } catch (err) {
        next(err)
    }
}

exports.updateProfileCont = async (req, res, next) => {
    try {
        if (!req.user.userId) return next(createError('login to update profile', 403))

        const updatedProfile = await updateProfile(req.user.userId, req.body)

        // if (!updatedProfile) return next(createError('profile nt found !', 404))

        res.status(200).json(updatedProfile)
    } catch (err) {
        next(err)
    }
}


exports.getProfileCont = async (req, res, next) => {
    try {
        if (!req.user.userId) return next(createError('login to view profile', 403))
        const profile = await getProfile(req.params.id)
        if (!profile) return next(createError('profile nt found !', 404))
        res.status(200).json(profile)
    } catch (err) {
        next(err)
    }
}


exports.addSocialLinksCont = async (req, res, next) => {
    if (!req.user.userId) return next(createError('login to view profile', 403))
    try {
        const updated = await addSocialLinks(req.user.userId,req.body)
        if (!updated) return next(createError('profile not found ', 404))
        res.status(200).json(updated)
    } catch (err) {
        next(err)
    }
}



exports.addAffiliateLinkCont = async (req, res, next) => {
    if (!req.user.userId) return next(createError('login to view profile', 403))
    try {
        const updated = await addAffiliateLinks(req.user.userId,req.body)
        if (!updated) return next(createError('profile not found ', 404))
        res.status(200).json(updated)
    } catch (err) {
        next(err)
    }
}


exports.deleteProfileCont = async (req, res, next) => {
    if (!req.user.isAdmin) return next(createError('unauthorized access', 403))
    try {
        const updated = await deleteProfile(req.params.id)
        if (!updated) return next(createError('profile not found ', 404))
        res.status(200).json({message:"profile deleted successfully !"})
    } catch (err) {
        next(err)
    }
}