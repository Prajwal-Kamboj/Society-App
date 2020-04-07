const User = require('../models/Users');
const ErrorResponse = require ('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// desc - Register User
//@route Get /api/v1/auth/register
//@access   public

exports.register = async (req,res,next) =>{
    try {
        const {name, email, password, role} = req.body;
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        sendTokenResponse(user,200,res);
        
    } catch (err) {
        next(err);
    }
};

// desc - login User
//@route Get /api/v1/auth/login
//@access   public

exports.login = async (req,res,next) =>{
    try {
        const { email, password} = req.body;
       
        // Validate Email
        if(!email || !password){
            return next(new ErrorResponse('Email and Password required', 400));

        }
        // Check for user
        const user = await  User.findOne ({email}).select('+password');

        if(!user){
            return next(new ErrorResponse('Invalid credentials',401));
        }

        // Check if password matches 
        const match = await user.matchPassword(password);

        if(!match) {
            return next(new ErrorResponse('Invalid credentials',401));
        }

        sendTokenResponse(user,200,res);
        
    } catch (err) {
        next(err);
    }

    
};


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };

    res
    .status(statusCode)
    .cookie('token',token,options)
    .json({
        success: true,
        token
    });
};


// desc       Get current logged in user
//@route      POST /api/v1/auth/me
//@access     Private
exports.getMe = asyncHandler(async (req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
})