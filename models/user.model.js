const mongoose = require("mongoose")
const mongoosePaginate = require('mongoose-paginate-v2')
const mongooseVirtuals = require('mongoose-lean-virtuals')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        min: 3,
        max: 30
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fromGoogle: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isadmin: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    others: {
        type: [mongoose.Schema.Types.Mixed]
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

userSchema.plugin(mongoosePaginate)
userSchema.plugin(mongooseVirtuals)
userSchema.virtual('profile', {
    ref: 'profiles',
    localField: '_id',
    foreignField: 'userId',
    justOne: true 
});



module.exports = mongoose.model('users', userSchema)

