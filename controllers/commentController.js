const { addComment, updateComment, deleteComment, likeDislikeComment, getTopLevelComments, gteRepliesComments } = require("../services/comment.service")
const createError = require("../utils/error")

exports.addCommentController = async (req, res, next) => {
    try {
        if (!req.user) return next(createError('Login to add comment !', 403))
        // console.log(req.params.id)
        const response = await addComment(req.params.id, req.user, req.body)
        if (!response) return next(createError('Comment not added !', 404))
        res.status(200).json(response);
    } catch (err) {
        next(err)
    }
}

exports.updateCommentController = async (req, res, next) => {
    try {
        if (!req.user) return next(createError('login to update comment !', 403))
        const response = await updateComment(req.params.id, req.user, req.body)
        if (!response) return next(createError('Comment not found !', 404))
        res.status(200).json(response);
    } catch (err) {
        next(err)
    }
}

exports.deleteCommentController = async (req, res, next) => {
    if (!req.user)
        return next(createError('login to delete comment !', 403))
    try {
        const response = await deleteComment(req.params.id, req.user)
        if (!response) return next(createError('Comment not found !', 404))
        res.status(200).json(response);
    } catch (err) {
        next(err)
    }
}

exports.likeDislikeCommentController = async (req, res, next) => {
    try {
        if (!req.user) return next(createError('login to like/dislike comment !', 403))
        const response = await likeDislikeComment(req.params.id, req.user)
        if (!response) return next(createError('Comment not found !', 404))
        res.status(200).json(response);
    } catch (err) {
        next(err)
    }
}

exports.getTopLevelCommentsCont = async (req, res) => {
    const { reviewId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    try {
        const comments = await getTopLevelComments(reviewId, page, limit)
        if (!comments) return next(createError('No comments found for this review', 404))
        res.json(comments);
    } catch (err) {
        next(err)
    }
};

exports.getRepliesForCommentCont = async (req, res) => {
    const { parentId } = req.params;

    const replies = await gteRepliesComments(parentId)

    if(!replies) {
        return res.status(404).json({ message: "No replies found for this comment" });
    }

    res.json(replies);
};
