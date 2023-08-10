const mongoose = require('mongoose');
const dotenv=require('dotenv')

dotenv.config();
const mongoURL = process.env.MONGO_URL;

const connectToMongo = async() => {
    try {
        await mongoose.connect(mongoURL);
        console.log("Connected To database Successfully")

    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToMongo;