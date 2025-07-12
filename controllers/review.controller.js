const { createRevService, getRevService, getReviews, updateReview } = require("../services/review.service")
const createError = require("../utils/error")

exports.createRevController = async (req, res, next) => {
    try {
        const response = await createRevService(req.user.userId, req.body)
        if (!response) return next(createError('error creating review', 404))
        res.status(200).json(response)
    } catch (err) {
        next(err)
    }
}

exports.getAreview = async (req, res, next) => {
    try {
        const response = await getRevService(req.params.id)
        if (!response) return next(createError('review not found !', 404))
        res.status(200).json(response)
    } catch (err) {
        next(err)
    }
}

exports.getAllReviews = async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const q = req.query
    try {
        const response = await getReviews(q,page, limit)
        if(!response) return next(createError("reviews not found !", 404))
            res.status(200).json(response)
    } catch (err) {
        next(err)
    }
}

exports.updateReviewCont = async (req,res,next) =>{
    try{
        if(!req.user) return next(createError('unauthorized user !', 404))
            const response = await updateReview(req.params.id,req.body, req.user)
        if(!response) return next(createError("review not found !", 404))
            res.status(200).json(response)
    }catch(err){
        next(err)
    }
}