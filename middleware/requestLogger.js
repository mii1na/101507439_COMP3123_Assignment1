const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Use console logs on Vercel and file logs locally
const isProduction =
    process.env.VERCEL === "1" ||
    process.env.NODE_ENV === "production";

let appLog;
let errorLog;

if (isProduction) {
    // Vercel displays these in the Logs dashboard
    appLog = process.stdout;
    errorLog = process.stderr;
} else {
    // Create local logs folder
    const logDirectory = path.join(__dirname, "../logs");

    fs.mkdirSync(logDirectory, { recursive: true });

    appLog = fs.createWriteStream(
        path.join(logDirectory, "app.log"),
        { flags: "a" }
    );

    errorLog = fs.createWriteStream(
        path.join(logDirectory, "error.log"),
        { flags: "a" }
    );
}

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

    if (level === "ERROR") {
        errorLog.write(entry);

        // Keep errors in both local log files
        if (!isProduction) {
            appLog.write(entry);
        }
    } else {
        appLog.write(entry);
    }
};

module.exports = { requestLogger, logEvent };
