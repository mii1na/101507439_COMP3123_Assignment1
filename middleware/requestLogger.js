const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Create logs folder if it does not exist
const logDirectory = path.join(__dirname, "../logs");

fs.mkdirSync(logDirectory, { recursive: true });

// Create log files
const appLog = fs.createWriteStream(
    path.join(logDirectory, "app.log"),
    { flags: "a" }
);

const errorLog = fs.createWriteStream(
    path.join(logDirectory, "error.log"),
    { flags: "a" }
);

// Log request path without query parameters
morgan.token("safe-path", (req) => req.path);

// Log HTTP requests
const requestLogger = morgan(
    ":date[iso] :method :safe-path :status :response-time ms",
    { stream: appLog }
);

// Log application events
const logEvent = (message, level = "INFO") => {
    const entry = `${new Date().toISOString()} [${level}] ${message}\n`;

    appLog.write(entry);

    if (level === "ERROR") {
        errorLog.write(entry);
    }
};

module.exports = { requestLogger, logEvent };
