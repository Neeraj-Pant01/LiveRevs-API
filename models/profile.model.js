const mongoose = require("mongoose")
const mongosePaginate = require("mongoose-paginate-v2")
const mongooseVirtuals = require('mongoose-lean-virtuals')

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
    },
    socilaLinks: [
        {
            platform: {
                type: String
            },
            link: {
                type: String
            }
        }
    ],
    affiliateLinks: [
        {
            productName: {
                type: String,

            },
            productLink: {
                type: String
            }
        }
    ],
    followers: [String],
    followings: [String],
    reviews: [String],
    saved: [String],
    liked: [String]
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

profileSchema.plugin(mongosePaginate)
profileSchema.plugin(mongooseVirtuals)


module.exports = mongoose.model('profiles', profileSchema)