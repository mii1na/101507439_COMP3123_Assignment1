const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const { logEvent } = require("../middleware/requestLogger");

// Get all employees belonging to the logged-in user
const getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find({
            user: req.userId
        });

        logEvent("Employees retrieved successfully");

        res.status(200).json(employees);
    } catch (error) {
        next(error);
    }
};

// Create an employee
const createEmployee = async (req, res, next) => {
    try {
        const {
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department
        } = req.body;

        const employee = await Employee.create({
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department,
            user: req.userId
        });

        logEvent("Employee created successfully");

        res.status(201).json({
            message: "Employee created successfully",
            employee
        });
    } catch (error) {
        next(error);
    }
};

// Get an employee by ID
const getEmployeeById = async (req, res, next) => {
    try {
        const { eid } = req.params;

        if (!mongoose.isValidObjectId(eid)) {
            return res.status(400).json({
                message: "Invalid employee ID"
            });
        }

        const employee = await Employee.findById(eid);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        if (employee.user.toString() !== req.userId.toString()) {
            logEvent("Unauthorized employee access attempt", "WARN");

            return res.status(403).json({
                message: "Access denied"
            });
        }

        logEvent("Employee retrieved successfully");

        res.status(200).json(employee);
    } catch (error) {
        next(error);
    }
};

// Update an employee
const updateEmployee = async (req, res, next) => {
    try {
        const { eid } = req.params;

        if (!mongoose.isValidObjectId(eid)) {
            return res.status(400).json({
                message: "Invalid employee ID"
            });
        }

        const employee = await Employee.findById(eid);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        if (employee.user.toString() !== req.userId.toString()) {
            logEvent("Unauthorized employee update attempt", "WARN");

            return res.status(403).json({
                message: "Access denied"
            });
        }

        const allowedFields = [
            "first_name",
            "last_name",
            "email",
            "position",
            "salary",
            "date_of_joining",
            "department"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided"
            });
        }

        const updatedEmployee = await Employee.findOneAndUpdate(
            {
                _id: eid,
                user: req.userId
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        logEvent("Employee updated successfully");

        res.status(200).json({
            message: "Employee updated successfully",
            employee: updatedEmployee
        });
    } catch (error) {
        next(error);
    }
};

// Delete an employee
const deleteEmployee = async (req, res, next) => {
    try {
        const { eid } = req.query;

        if (!mongoose.isValidObjectId(eid)) {
            return res.status(400).json({
                message: "Invalid employee ID"
            });
        }

        const employee = await Employee.findById(eid);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        if (employee.user.toString() !== req.userId.toString()) {
            logEvent("Unauthorized employee deletion attempt", "WARN");

            return res.status(403).json({
                message: "Access denied"
            });
        }

        const deletedEmployee = await Employee.findOneAndDelete({
            _id: eid,
            user: req.userId
        });

        if (!deletedEmployee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        logEvent("Employee deleted successfully");

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};
