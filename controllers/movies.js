const movieModel = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const DataError = require('../errors/data-error');
const UnknownError = require('../errors/unknown-error');
const MasterError = require('../errors/master-error');

function readUserMovies(req, res, next) {
  return movieModel.find()
    .then((cards) => res.send(cards))
    .catch((err) => next(new UnknownError(`Неизвестная ошибка: : ${err.message}`)));
}

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;
  return movieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') return next(new DataError(`Неверные входные данные: : ${err.message}`));
      return next(new UnknownError(`Неизвестная ошибка: : ${err.message}`));
    });
}

function deleteMovie(req, res, next) {
  return movieModel.findById(req.params.movieId)
    .then((card) => {
      if (!card) return next(new NotFoundError('Фильм не найден'));

      if ((String)(card.owner) !== (String)(req.user._id)) return next(new MasterError('Этот фильм добавил другой пользователь'));

      return movieModel.deleteOne({ _id: req.params.movieId })
        .then((result) => {
          const { deletedCount } = result;

          if (deletedCount === 0) return next(new NotFoundError('Фильм не найден'));
          return res.send({ message: 'Фильм успешно удален' });
        })
        .catch((err) => {
          if (err.name === 'CastError') return next(new DataError(`Неверные входные данные: : ${err.message}`));
          return next(new UnknownError(`Неизвестная ошибка: : ${err.message}`));
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new DataError(`Неверные входные данные: ${err.message}`));
      return next(new UnknownError(`Неизвестная ошибка: ${err.message}`));
    });
}

module.exports = {
  readUserMovies,
  createMovie,
  deleteMovie,
};
