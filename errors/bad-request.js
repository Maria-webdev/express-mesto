class BadRequestError extends Error {
    constuctor(message) {
        super(message);
        this.statusCode = 400;
    }
}

module.exports = BadRequestError;