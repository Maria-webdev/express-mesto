class NotAuthError extends Error {
    constuctor(message) {
        super(message);
        this.statusCode = 401;
    }
}

module.exports = NotAuthError;