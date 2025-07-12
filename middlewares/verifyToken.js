const createError = require("../utils/error")
const jwt = require('jsonwebtoken')


exports.verifyToken = (req, res, next) => {
    const authheader = req.headers.authorization;
    if (!authheader) return next(createError("token is not present", 404));
    const parts = authheader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return next(createError('Authorization header malformed', 400));
    }
    const token = parts[1];
    // console.log(authheader)
    if (!token) return next(createError('token not present', 404));
    jwt.verify(token, process.env.JWTKEY, (err, payload) => {
        if (err) {
            return next(createError('invalid token !', 403));
        }
        req.user = payload;
        next();
    });
}