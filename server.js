const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env'});

const AppError = require('./utils/appError');
const GlobalErrorMiddleware = require('./constrollers/errorControllerHandler')

const usersRoute =  require('./routes/users');
const authRoute = require('./routes/auth');
const contactRoute = require('./routes/contact');

const app = express();
app.use(cors());

//=== Handle any unCaught Rejection from anywhere in the application for example using undeclired variable
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION: SHUTTING DOWN THE SERVER..');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
});

const DB = process.env.MONGO_DB_URI;

//====Establish connection 
const connectDB = async() => {
    try {
        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log("Database connected.....");
        console.log("##################################################");

    } catch (err) {
        console.log("Connection FAILED")
        console.log(err.message);
        process.exit(1);
    }
}

connectDB();


//initialize the Middleware
app.use(express.json({ extended: false }));

//=== Define Routes
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/contacts', contactRoute);

//====Check if the environment 
if(process.env.NODE_ENV === 'production'){
    //==== Set the static folder
    app.use(express.static('client/build'));
    
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

//===Global 404 response
app.all('*', (req, res, next) => {
    
    // res.status(404).json({
    //     status: 'Fail',
    //     message: `The request you made on ${req.originalUrl} can't be found.`
    // })

    //Create error to be handle by the error middleware
    // const err = new Error(`The request you made on ${req.originalUrl} can't be found.`)
    // err.statusCode = 404;
    // err.status = "fail";

    //=== call next and pass the err as an argument
    // next(err) 

    next(new AppError(`The request you made on ${req.originalUrl} can't be found.`, 404))
});



//==== Express error handling middleware => takes 4 arguments 
// app.use((err, req, res, next) => {

//     console.log(err.stack);

//     err.statusCode = err.statusCode || 5000;
//     err.status = err.status || "error";

//     res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message
//     })
// })


//==== Global Error Handling exported to its own middleware
app.use(GlobalErrorMiddleware);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The app is running on Port ${PORT}`));

//=== Handle any unhandled Rejection from anywhere in the application for example failure to Connect to DB 
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION: SHUTTING DOWN THE SERVER..');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
})