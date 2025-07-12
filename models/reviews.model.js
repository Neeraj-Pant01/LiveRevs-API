const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2")
const mongooseVirtuals = require("mongoose-lean-virtuals")

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: "true"
    },
    productName: {
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    categories:{
        type:[String]
    },
    productImage:{
        type:String,
        required:true
    },
    productImages:{
        type:[String]
    },
    brandname: {
        type: String,
        required: true
    },
    specifications: [String],
    description: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        mac: 5
    },
    review: {
        type: String,
        required: true
    },
    hastags: {
        type: [String]
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    isEdited: {
        type: Boolean,
        default: false
    },
    purchaseLink: {
        type: String,
    },
    quantity: {

    },
    shares: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    others: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

reviewSchema.virtual("likescount").get(function () {
    return this.likes.length
})

reviewSchema.plugin(mongoosePaginate)
reviewSchema.plugin(mongooseVirtuals)


module.exports = mongoose.model('reviews', reviewSchema)