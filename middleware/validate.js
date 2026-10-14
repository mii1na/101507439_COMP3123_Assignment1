const { logEvent } = require("./requestLogger");
const { body, param, query, validationResult } = require("express-validator");

// Return validation errors
const checkValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        logEvent(
            `Validation failed: ${req.method} ${req.path}`,
            "WARN"
        );

        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });
    }

    next();
};


// User signup validation
const signupValidation = [
    body("username")
        .isString()
        .withMessage("Username is required")
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be 3 to 30 characters"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .isString()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
];

// User login validation
const loginValidation = [
    body("username")
        .optional()
        .isString()
        .withMessage("Invalid username")
        .trim()
        .notEmpty()
        .withMessage("Username cannot be empty"),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .isString()
        .withMessage("Password is required")
        .notEmpty()
        .withMessage("Password cannot be empty"),

    body().custom(value => {
        if (!value.username && !value.email) {
            throw new Error("Username or email is required");
        }
        return true;
    })
];

// Employee validation
const employeeValidation = [
    body("first_name")
        .isString()
        .withMessage("First name is required")
        .trim()
        .notEmpty()
        .withMessage("First name cannot be empty"),

    body("last_name")
        .isString()
        .withMessage("Last name is required")
        .trim()
        .notEmpty()
        .withMessage("Last name cannot be empty"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid employee email"),

    body("position")
        .isString()
        .withMessage("Position is required")
        .trim()
        .notEmpty()
        .withMessage("Position cannot be empty"),

    body("salary")
        .isFloat({ gt: 0 })
        .withMessage("Salary must be a positive number")
        .toFloat(),

    body("date_of_joining")
        .isISO8601({ strict: true })
        .withMessage("Invalid date of joining")
        .toDate(),

    body("department")
        .isString()
        .withMessage("Department is required")
        .trim()
        .notEmpty()
        .withMessage("Department cannot be empty")
];

// Employee update validation
const employeeUpdateValidation = [
    body("first_name")
        .optional()
        .isString()
        .trim()
        .notEmpty(),

    body("last_name")
        .optional()
        .isString()
        .trim()
        .notEmpty(),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Invalid employee email"),

    body("position")
        .optional()
        .isString()
        .trim()
        .notEmpty(),

    body("salary")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Salary must be a positive number")
        .toFloat(),

    body("date_of_joining")
        .optional()
        .isISO8601({ strict: true })
        .withMessage("Invalid date of joining")
        .toDate(),

    body("department")
        .optional()
        .isString()
        .trim()
        .notEmpty()
];


// Employee ID validation
const employeeIdValidation = [
    param("eid")
        .isMongoId()
        .withMessage("Invalid employee ID")
];

// Delete employee ID validation
const deleteEmployeeValidation = [
    query("eid")
        .isMongoId()
        .withMessage("Invalid employee ID")
];

module.exports = {
    checkValidation,
    signupValidation,
    loginValidation,
    employeeValidation,
    employeeUpdateValidation,
    employeeIdValidation,
    deleteEmployeeValidation
};
