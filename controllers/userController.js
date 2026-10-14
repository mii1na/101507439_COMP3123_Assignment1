const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { logEvent } = require("../middleware/requestLogger");

// Register a new user
const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { username: username.trim().toLowerCase() },
                { email: email.trim().toLowerCase() }
            ]
        });

        if (existingUser) {
            logEvent("Signup failed: User already exists", "WARN");

            return res.status(409).json({
                message: "Username or email already exists"
            });
        }

        const user = await User.create({
            username,
            email,
            password
        });

        logEvent("New user registered successfully");

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

// Login with username or email
const login = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        logEvent("Login attempt received");

        const identifier = username || email;

        if (!identifier || !password) {
            logEvent("Login failed: Missing credentials", "WARN");

            return res.status(400).json({
                message: "Username/email and password are required"
            });
        }

        const user = await User.findOne({
            $or: [
                { username: identifier.trim().toLowerCase() },
                { email: identifier.trim().toLowerCase() }
            ]
        }).select("+password");

        if (!user) {
            logEvent("Login failed: Invalid credentials", "WARN");

            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            logEvent("Login failed: Invalid credentials", "WARN");

            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        logEvent("User logged in successfully");

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { signup, login };
