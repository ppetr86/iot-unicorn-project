class CustomApiError extends Error {
    constructor(message, statusCode) {
        super(message)
        console.error(message);
        this.statusCode = statusCode
    }
}

module.exports = {CustomApiError}
