const userModel = require('../models/user.model')
const bcryptjs = require('bcryptjs');
const createError = require('../utils/error');


exports.updateUserService = async (userId, updatedData) => {
    const updatedUser = await userModel.findByIdAndUpdate(userId, {
        $set: updatedData
    }, {
        new: true, runValidators: true
    })
    return updatedUser;
}

exports.forgotPassService = async (email, updatedPass) => {
    const hashPass = bcryptjs.hashSync(updatedPass, 10)
    const updatedUser = await userModel.findOneAndUpdate({ email }, {
        $set: { password: hashPass }
    }, {
        new: true, runValidators: true
    })

    if (!updatedUser) return next(createError('user not found', 404))

    return updatedUser;
}


exports.deleteUserService = async (userId) => {
    const deleteUser = await userModel.findByIdAndDelete(userId)
    if (!deleteUser) return next(createError('user not found !', 404))
    return { message: "user delted successfully !" }
}

exports.disableAccount = async (userId) => {
    const disableUser = await userModel.findByIdAndUpdate(userId, {
        $set: { disabled: true }
    }, {
        new: true, runValidators: true
    })
    return disableUser;
}


exports.getSingleUserService = async (id, isAdmin) => {
    const user = await userModel.findById(id)
    const { password, isadmin, fromGoogle, ...others } = user._doc;
    return isAdmin ? user : others
}


exports.getAllUsersService = async (isAdmin, page, limit, q) => {
    const { search, sort, status, verified, from } = q;
    // const query = search ?
    // {
    //     $or :[
    //         {name : {$regex : search , $options : 'i'}},
    //         {email : {$regex : search, $options : 'i'}}
    //     ]
    // }
    // : {}

    const filters = {
        ...(search && {
            $or: [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }),
        ...(status === 'disabled' && { disabled: true }),
        ...(verified === 'true' && { isVerified: true }),
        ...(from === 'google' && { fromGoogle: true })
    };


    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    if (isAdmin) {
        const options = {
            page: page || 1,
            limit: limit || 10,
            sort: sortOption
        }
        return await userModel.paginate(filters, options)
    } else {
        return { message: "unauthorized access !" }
    }
}