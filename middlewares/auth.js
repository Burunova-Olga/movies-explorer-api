require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const NoAccessError = require('../errors/no-access-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NoAccessError('Необходима авторизация'));
  }

  const key = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, key);
  } catch (err) {
    next(new NoAccessError('Необходима авторизация:'));
  }

  req.user = payload;
  next();
};
