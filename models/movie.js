const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  director:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  duration:
  {
    type: Number,
    required: [true, 'Поле должно быть заполнено'],
  },
  year:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  description:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  image:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: [validator.isURL, 'Строка не ссылка'],
  },
  trailerLink:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: [validator.isURL, 'Строка не ссылка'],
  },
  thumbnail:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: [validator.isURL, 'Строка не ссылка'],
  },
  owner:
  {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId:
  {
    type: Number,
    required: true,
  },
  nameRU:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  nameEN:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
