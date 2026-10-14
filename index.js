require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
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

// API routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "API is running"
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        logEvent(`Server started on port ${PORT}`);
    });
});
