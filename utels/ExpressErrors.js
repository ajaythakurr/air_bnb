class ExpressError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode || 500; // Default to 500 if not provided
        this.message = message || "Something went wrong"; // Default message
    }
}

module.exports = ExpressError;