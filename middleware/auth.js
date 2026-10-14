const jwt = require("jsonwebtoken");
const { logEvent } = require("./requestLogger");

const auth = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        logEvent("Authentication failed: Missing JWT", "WARN");

        return res.status(401).json({
            message: "Authentication token is required"
        });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;
        next();
    } catch (error) {
        logEvent("Authentication failed: Invalid or expired JWT", "WARN");

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = auth;
