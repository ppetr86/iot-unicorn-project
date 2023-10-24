const mongoose = require("mongoose").default;

const connectDB = async (url) => {
    await mongoose.connect(url);
    console.log("Connected to DB");
}

module.exports = connectDB;
