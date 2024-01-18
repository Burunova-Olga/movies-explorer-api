const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символа'],
  },
  director:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символа'],
  },
  duration:
  {
    type: Number,
    required: [true, 'Поле должно быть заполнено'],
    min: [0.1, 'Продолжительность фильма не может быть нулевой'],
  },
  year:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [4, 'До 1000-го года фильмы не снимали'],
    maxlength: [4, 'Обращение зафиксировано. Сотрудник ФСБ прибудет в течение 10 минут для изъятия Вашей машины времени. Просьба не оказывать сопротивления.'],
  },
  description:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля 2 символа'],
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
      minlength: [2, 'Минимальная длина поля 2 символа'],
      maxlength: [30, 'Максимальная длина поля 30 символа'],
    },
  nameEN:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символа'],
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
