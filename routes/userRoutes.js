const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/userController");

const authLimiter = require("../middleware/rateLimiter");
const checkRequestFields = require("../middleware/requestFields");

const {
    signupValidation,
    loginValidation,
    checkValidation
} = require("../middleware/validate");

const userFields = ["username", "email", "password"];

// User signup
router.post(
    "/signup",
    authLimiter,
    checkRequestFields(userFields),
    signupValidation,
    checkValidation,
    signup
);

// User login
router.post(
    "/login",
    authLimiter,
    checkRequestFields(userFields),
    loginValidation,
    checkValidation,
    login
);

module.exports = router;
