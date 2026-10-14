const { logEvent } = require("./requestLogger");

const maxLengths = {
    username: 30,
    email: 254,
    password: 72,
    first_name: 60,
    last_name: 60,
    position: 100,
    department: 100
};

const checkRequestFields = (allowedFields) => {
    return (req, res, next) => {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            logEvent("Invalid request body", "WARN");

            return res.status(400).json({
                message: "Request body must be a JSON object"
            });
        }

        // Reject unexpected fields
        const unexpectedFields = Object.keys(req.body).filter(
            field => !allowedFields.includes(field)
        );

        if (unexpectedFields.length > 0) {
            logEvent("Unexpected request fields", "WARN");

            return res.status(400).json({
                message: "Unexpected fields",
                fields: unexpectedFields
            });
        }

        // Check maximum string lengths
        for (const field of Object.keys(req.body)) {
            const value = req.body[field];
            const max = maxLengths[field];

            if (max && typeof value === "string") {
                const length = field === "password"
                    ? Buffer.byteLength(value, "utf8")
                    : value.length;

                if (length > max) {
                    logEvent("Input length validation failed", "WARN");

                    return res.status(400).json({
                        message: `${field} is too long`
                    });
                }
            }
        }

        next();
    };
};

module.exports = checkRequestFields;
