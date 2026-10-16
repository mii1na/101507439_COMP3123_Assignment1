require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const {
    requestLogger,
    logEvent
} = require("./middleware/requestLogger");

const {
    notFound,
    errorHandler
} = require("./middleware/errorHandler");

const app = express();

// Security
app.use(helmet());

// Request logging
app.use(requestLogger);

// Parse JSON requests
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "API is running"
    });
});

// Make sure MongoDB is connected before API requests
app.use(async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }
        next();
    } catch (error) {
        next(error);
    }
});

// API routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Start the server locally
if (process.env.VERCEL !== "1") {
    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
                logEvent(`Server started on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error("Server startup failed:", error.message);
            process.exitCode = 1;
        });
}

// Export Express app for Vercel
module.exports = app;
