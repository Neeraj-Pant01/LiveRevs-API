const { loginService, RegisterService } = require("../services/auth.services");
const createError = require("../utils/error");

exports.RegisterCOntroller = async (req,res,next) =>{
    const {fullName,email,password} = req.body;
    if(!fullName || !email || !password){
        return next(createError('all feilds are compoulsory', '400'))
    }
    try{
        const registerData = {
            fullName,
            email,
            password
        }
        const user = await RegisterService(registerData)
        res.status(200).json(user)
    }catch(err){
        next(err)
    }
}


exports.loginUser = async (req,res,next) =>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(createError('both email and password are required !', '400'))
    }
    try{
        const logindata = {
            email,password
        }
        const user = await loginService(logindata)
        res.status(200).json(user)
    }catch(err){
        next(err)
    }
}