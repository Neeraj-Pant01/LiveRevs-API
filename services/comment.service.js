const commentModel = require("../models/comment.model");

exports.addComment = async (revId, user, revData) => {
    // console.log(revData)
    const comment = new commentModel({
        review: revId,
        user: user?.userId,
        userName: revData.userName,
        profilePic: revData.profilePic,
        isVerified: revData.isVerified,
        text: revData.text,
        parent: revData.parent || null,
    })
    const review = new commentModel(comment);
    const saved = await review.save();
    return saved;
}

exports.updateComment = async (commentId, user, updatedCommentData) => {
    const query = {
        _id: commentId,
        $or: [
            { user: user.userId }
        ]
    }
    const comment = await commentModel.findOneAndUpdate(query, {
        $set: {
            text: updatedCommentData.text
        }
    }, {
        new: true,
        runValidators: true
    })
    console.log(query);
    return comment;
}

exports.deleteComment = async (commentId, user) => {
    const query = {
        _id: commentId,
        $or: [
            { user: user.userId }
        ]
    };

    let commentToDelete;

    // Admin can bypass the query check
    if (user.isAdmin) {
        commentToDelete = await commentModel.findByIdAndDelete(commentId);
    } else {
        commentToDelete = await commentModel.findOneAndDelete(query);
    }

    if (!commentToDelete) {
        throw new Error("Comment not found or you are not authorized to delete this comment");
    }

    // Check if this comment is a parent (i.e., has replies)
    const deletedChildren = await commentModel.deleteMany({ parent: commentToDelete._id });

    return {
        message: "Comment deleted successfully!",
        deletedRepliesCount: deletedChildren.deletedCount || 0
    };
};


exports.likeDislikeComment = async (commentId, user) => {
    const comment = await commentModel.findById(commentId);
    if (comment.likes.includes(user.userId)) {
        const updatedComment = await commentModel.findByIdAndUpdate(commentId, {
            $pull: { likes: user.userId }
        }, {
            new: true,
            runValidators: true
        })
        return updatedComment;
    }
    const updatedComment = await commentModel.findByIdAndUpdate(commentId, {
        $addToSet: { likes: user.userId }
    }, {
        new: true,
        runValidators: true
    })
    return updatedComment;
}

exports.getTopLevelComments = async (reviewId,page,limit) => {
    const comments = await commentModel.paginate(
        { review: reviewId, parent: null },
        {
            page,
            limit,
            sort: { createdAt: -1 },
            lean: true,
            virtuals: true
        }
    );
    // console.log(comments)
    return comments;
}

exports.gteRepliesComments = async (parentId) =>{
        const replies = await commentModel.find({ parent: parentId })
        .sort({ createdAt: 1 })
        .populate('user', 'fullName profilePic')
        .lean({ virtuals: true });

        return replies ;
}
