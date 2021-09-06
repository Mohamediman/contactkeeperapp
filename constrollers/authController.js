//===== this middleware will check if there is a valid token in the header
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.auth = catchAsync(async(req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    
    if(!token){
        return next( new AppError("invalid Token, Authorization denied"), 401)
    };

    const decoded = jwt.verify(token, process.env.MONGO_SECRET);
    req.user = decoded.user;

    next();
})

exports.getLoginUser = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.user.id).select('-password');
    if(!user) return next(new AppError("No user with that credentials found", 400));
    res.status(200).json({ user });
})

exports.loginIn = catchAsync(async(req, res, next) => {
        const { email, password } = req.body;

        let user = await User.findOne({ email });

        if(!user) {
            return next(new AppError("invalid Credentials", 400))
        }

        //=== Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);


        if(!isMatch) return next( new AppError("invalid Credentials", 400))

        //====Create payload for the toke
        const payload = {
            user: {
                id: user.id
            }
        };

        //====Sign in and send the token back
    const token = jwt.sign(payload, process.env.MONGO_SECRET, {
        expiresIn: 36000
     })

     console.log("Token Generated:", token);

     res.status(200).json({
         status: 'success',
         token
     })
})

//===Signup new users
exports.signUp = catchAsync(async(req, res, next) => {
    const { name, email, password } = req.body;
    
    if(!name || !email || !password){
        return next(new AppError("All fields are required", 400))
    }
    
        let user = await User.findOne({email});
        
        if(user){
            return next(new AppError("The User already exists", 400))
        }
        user = new User({name, email, password});
        
        //====Hashing the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        //=====Save the user into the database
        await user.save();
        
        //====Create payload for the toke
        const payload = {
            user: {
                id: user.id
            }
        };
        
        //====Sign in and send the token back
        jwt.sign(payload, process.env.MONGO_SECRET, {
            expiresIn: 36000
        }, (err, token) =>{
            if(err) throw err;
            res.status(201).json({
                status: 'success',
                token
            })
    });

})