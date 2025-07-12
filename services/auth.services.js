const userModel = require('../models/user.model')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const createError = require('../utils/error')

exports.RegisterService = async (userdata) => {
    const hashpass = bcryptjs.hashSync(userdata.password, 10)
    const newUser = new userModel({ ...userdata, password: hashpass })
    const savedUser = await newUser.save();
    return savedUser;
}


exports.loginService = async (loginCredentials) => {
    const user = await userModel.findOne({ email: loginCredentials.email })

    if (!user) throw createError('user not found', '404')
    const correctPassword = bcryptjs.compareSync(loginCredentials.password, user.password)

    if (!correctPassword) throw createError('invalid email or password !', '403')

    const token = jwt.sign({userId:user._id, isAdmin:user.isadmin,isVerified:user.isVerified},process.env.JWTKEY,{expiresIn:'1hr'})

    const {password, ...others} = user._doc;
    return {...others, token:token}
}