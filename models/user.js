const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    unique: [true, 'Такой email уже зарегестрирован'],
    validate: [validator.isEmail, 'Строка не email'],
    useCreateIndex: true,
    autoIndex: true,
  },
  password:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    select: false,
  },
  name:
  {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
