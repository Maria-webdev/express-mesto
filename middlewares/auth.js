const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/not-found');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const { JWT_SECRET = 'super-strong-secret' } = process.env;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthError('Проблемы с аутентификацией');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new NotAuthError('Проблемы с аутентификацией');
  }
  req.user = payload;
  next();
};
