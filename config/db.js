const mongoose = require("mongoose"); // Fixed import

const connectDb = async () => {
    const dbUrl = process.env.DBURL;
    if (!dbUrl) {
        console.error("DBURL environment variable is not set.");
        process.exit(1);
    }
    try {
        await mongoose.connect(dbUrl);
        console.log("Database is connected successfully!");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectDb;