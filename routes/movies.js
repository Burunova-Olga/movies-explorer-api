const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const movieController = require('../controllers/movies');

router.get('/movies', movieController.readUserMovies);

const linkPattern = /((http|https):\/)?\/(w{3}.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=/]/;
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(linkPattern),
    trailerLink: Joi.string().required().pattern(linkPattern),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(linkPattern),
    movieId: Joi.number().required(),
  }),
}), movieController.createMovie);

router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), movieController.deleteMovie);

module.exports = router;
