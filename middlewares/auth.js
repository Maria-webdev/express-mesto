const NotAuthError = require('../errors/not-found');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const { JWT_SECRET = 'super-strong-secret' } = process.env;

    if (!authorization || !authorization.startWith('Bearer ')) {
        throw new NotAuthError({ message: 'Проблемы с аутентификацией' });
    }

    const token = authorization.replace('Bearer ', '');

    let payload;

    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new NotAuthError({ message: 'Проблемы с аутентификацией' });
    }
    req.user = payload;
    next();
}