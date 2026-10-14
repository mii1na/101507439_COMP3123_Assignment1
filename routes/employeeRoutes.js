const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkRequestFields = require("../middleware/requestFields");

const {
    getEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

const {
    employeeValidation,
    employeeUpdateValidation,
    employeeIdValidation,
    deleteEmployeeValidation,
    checkValidation
} = require("../middleware/validate");

const employeeFields = [
    "first_name",
    "last_name",
    "email",
    "position",
    "salary",
    "date_of_joining",
    "department"
];

// Protect all employee routes
router.use(auth);

// Get all employees
router.get("/employees", getEmployees);

// Create employee
router.post(
    "/employees",
    checkRequestFields(employeeFields),
    employeeValidation,
    checkValidation,
    createEmployee
);

// Get employee by ID
router.get(
    "/employees/:eid",
    employeeIdValidation,
    checkValidation,
    getEmployeeById
);

// Update employee
router.put(
    "/employees/:eid",
    employeeIdValidation,
    checkRequestFields(employeeFields),
    employeeUpdateValidation,
    checkValidation,
    updateEmployee
);

// Delete employee
router.delete(
    "/employees",
    deleteEmployeeValidation,
    checkValidation,
    deleteEmployee
);

module.exports = router;
