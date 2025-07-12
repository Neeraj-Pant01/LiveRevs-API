const { followUser, unfollowUser } = require("../services/profile.service")
const { updateUserService, forgotPassService, deleteUserService, disableAccount, getSingleUserService, getAllUsersService } = require("../services/user.service")
const createError = require("../utils/error")

exports.updateUserCont = async (req, res, next) => {
    if (req.body.password) return next(createError("password can't be changed !"))
    const currenTuserId = req.user.userId
    const userToUpdate = req.params.id
    const newdata = req.body

    if (currenTuserId !== userToUpdate && !req.user.isAdmin) return next(createError('permission denied', 403))
    try {
        const updatedUser = await updateUserService(userToUpdate, newdata)
        if (!updatedUser) return next(createError('user not found', 404))
        res.status(200).json(updatedUser)
    } catch (err) {
        next(err)
    }
}


exports.frogotPassController = async (req, res, next) => {
    const { email, password } = req.body;
    if (req.body.email) {
        const updatedPassword = await forgotPassService(email, password)
        res.status(200).json(updatedPassword)
    } else {
        return next(createError('invalid user', 403))
    }
}

exports.deleteUserCont = async (req, res, next) => {
    const crrentUser = req.user.userId
    const targetId = req.params.id

    if (crrentUser !== targetId && !req.user.isAdmin) return next(createError('unauthorized access !', 403))
    try {
        const response = await deleteUserService(crrentUser)
        return res.status(200).json(response)
    } catch (err) {
        next(err)
    }
}


exports.disableAccount = async (req, res, next) => {
    const crrentUser = req.user.userId
    const targetId = req.params.id

    console.log(req.user)
    if (crrentUser !== targetId && !req.user.isAdmin) return next(createError('unauthorized access !', 403))
    try {
        const response = await disableAccount(crrentUser)
        return res.status(200).json(response)
    } catch (err) {
        next(err)
    }
}


exports.getSingleUserController = async (req, res, next) => {
    const userId = req.params.id;
    if (req.user) {
        const user = await getSingleUserService(userId, req.user.isAdmin)
        return res.status(200).json(user)
    } else {
        return next(createError('unauthorized access !'))
    }
}


exports.getAllUsersController = async (req, res, next) => {
    if (req.user.isAdmin) {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const q = req.query
        const users = await getAllUsersService(req.user.isAdmin, page, limit, q)
        res.status(200).json(users)
    } else {
        return next(createError('unauthorized access !'))
    }
}

exports.followUserController = async (req, res, next) => {
    if (req.user) {
        if (req.user.userId === req.params.id) return next(createError('you cannot follow yourself', 404))
        try {
            const response = await followUser(req.user.userId, req.params.id)
            if (!response) return next(createError('invalid response', 404))
            res.status(200).json(response)
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError("unauthorized access !"))
    }
}

exports.unfollowUserCOntroller = async (req, res, next) => {
    if (!req.user) return next(createError("unauthorized action", 403))
    if (req.user.userId === req.params.id) return next(createError("you cannot unfollow yourself !", 404))
    try {
        const response = await unfollowUser(req.user.userId, req.params.id)
        if (!response) return next(createError('invalid response', 404))
        res.status(200).json(response)
    } catch (err) {
        next(err)
    }
}