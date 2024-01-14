require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const DataError = require('../errors/data-error');
const UnknownError = require('../errors/unknown-error');
const DuplicateError = require('../errors/duplicate-error');
const NoAccessError = require('../errors/no-access-error');

function findUserByCredentials(email, password) {
  return userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new NoAccessError('Неправильные почта или пароль'));
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) return Promise.reject(new NoAccessError('Неправильные почта или пароль'));
          return user;
        });
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  return findUserByCredentials(email, password)
    .then((user) => {
      res
        .send({
          token: jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          ),
        });
    })
    .catch((err) => next(new NoAccessError(`Ошибка доступа: ${err.message}`)));
}

function createUser(req, res, next) {
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => userModel.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) return next(new DuplicateError(`Данный email уже зарегестрирован: ${err.message}`));

      if (err.name === 'ValidationError') return next(new DataError(`Неверные входные данные: ${err.message}`));

      return next(new UnknownError(`Неизвестная ошибка: : ${err.message}`));
    });
}

function readMe(req, res, next) {
  return userModel.findById(req.user._id)
    .then((user) => {
      if (!user) return next(new NotFoundError('Пользователь не найден'));
      return res.send({ message: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new DataError(`Неверные входные данные: ${err.message}`));

      if (err.name === 'ReferenceError') return next(new NotFoundError(`Пользователь не найден: ${err.message}`));
      return next(new UnknownError(`Неизвестная ошибка: ${err.message}`));
    });
}

function updateUser(req, res, next) {
  const { name, email } = req.body;

  return userModel.findByIdAndUpdate(
    req.user._id,
    { $set: { name, email } },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) return next(new NotFoundError('Пользователь не найден'));
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return next(new DataError(`Неверные входные данные: ${err.message}`));
      return next(new UnknownError(`Неизвестная ошибка: ${err.message}`));
    });
}

module.exports = {
  login,
  createUser,
  readMe,
  updateUser,
};
