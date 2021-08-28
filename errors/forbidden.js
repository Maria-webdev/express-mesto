class Forbidden extends Error {
    constuctor(message) {
        super(message);
        this.statusCode = 403;
    }
}

module.exports = Forbidden;