class ConflictError extends Error {
    constuctor(message) {
        super(message);
        this.statusCode = 409;
    }
}

module.exports = ConflictError;