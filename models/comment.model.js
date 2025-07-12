const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const mongooseVirtuals = require("mongoose-lean-virtuals");

const commentSchema = new mongoose.Schema({
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reviews',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    text: {
        type: String,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ],
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments',
        default: null
    },
    isEdited: {
        type: Boolean,
        default: false
    }
},{
    timestamps:true,
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
})

commentSchema.index({ user: 1 });
commentSchema.index({ review: 1 });
commentSchema.index({ parent: 1 });

commentSchema.virtual('likesCount').get(function(){
    return this.likes.length;
})

commentSchema.virtual('repliesCount',{
    ref:"comments",
    localField:"_id",
    foreignField:"parent",
    count:true
})

commentSchema.plugin(mongoosePaginate)
commentSchema.plugin(mongooseVirtuals)

module.exports = mongoose.model('comments', commentSchema)


