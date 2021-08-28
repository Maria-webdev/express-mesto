class NotFoundError extends Error {
    constuctor(message) {
        super(message);
        this.statusCode = 404;
    }
}

module.exports = NotFoundError;