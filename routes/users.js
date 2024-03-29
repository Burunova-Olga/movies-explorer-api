const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userController = require('../controllers/users');

router.get('/users/me', userController.readMe);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), userController.updateUser);

module.exports = router;
