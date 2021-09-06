
const AppError = require('./../utils/appError');

/*====== START OF THE THREE MONGODB OPERATIONAL ERRORS=======*/
const handleCastErrorDB = err => {  //==> INVALID ID THAT CAN'T BE FOUND
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    //==> DUPLICATE FIELDS IE TRYING TO USE AN EMAIL THAT IS ALREADY REGISTERED
    const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const resp = `Duplicate Value for: ${value}. Please use another value`;
    return new AppError(resp, 400);
}

const handleDValidationErrorDB = err => {
    //==> MONGOOSE/MONGODB VALIDATION ERRORS. IE REQUIRED PASSWORD, MIN LENGTH OF NAME ETC
    const errors = Object.values(err.errors).map(val => val.message);
    const message = `Invalid Error. ${errors.join('. ')}`;

    return new AppError(message, 400);
}
/*====== END OF THE THREE MONGODB OPERATIONAL ERRORS=======*/

/*====== JWT ERRORS ERRORS=======*/
            //==>when the Token is wrong
const handleJwtError = err => new AppError('Invalid token, Please log in again', 401);

        //==> When the token already has expired 
const handleJwtExpiredError = err => new AppError('Your token has expired, Please log in again', 401);
/*====== END OF JWT ERRORS ERRORS=======*/



const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        error: err,
        status: err.status,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    //operational error that we trust, send the message
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
        
        //=== Program or unknow error, do not leak the message or other information
     } else {
         //1: Log the error to the console
         console.error("Error", err)

         //2: respond with generic message
         res.status(500).json({
             status: 'error',
             message: 'something went very wrong:::'
         })
     }
}

module.exports = (err, req, res, next) => {
    console.log(err.stack);
    err.statusCode = err.statusCode || 5000;
    err.status = err.status || "error";
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    }else if(process.env.NODE_ENV === 'production'){
        // let error = { ...err };
        let error = Object.assign(err)

        //===> Turning Wierd MongoDB into an Operational Error 
        if(error.name === 'CastError') error = handleCastErrorDB(error)
        if(error.code === 11000) error = handleDuplicateFieldsDB(error)
        if(error.name === 'ValidationError') error = handleDValidationErrorDB(error)
        if(error.name === 'JsonWebTokenError') error = handleJwtError(error)
        if(error.name === 'TokenExpiredError') error = handleJwtExpiredError(error)

        sendErrorProd(error, res);
    }  
}