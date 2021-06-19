const mongoose = require('mongoose');
const config = require('config');

const mongoURI = config.get('MongoURI');


const connectDB = async() => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log("Database connected ...")
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;