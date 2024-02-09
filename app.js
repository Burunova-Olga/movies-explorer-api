const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const  = require('helmet');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/express-rate-limit');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const app = express();

mongoose.connect(DB_URL)
  .then(() => {
    console.log('MongoDB connected');
  });

app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./routes/signup'));
app.use(require('./routes/signin'));

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFoundError('Неверный путь'));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (res.headersSent) return next(err);

  return res
    .status(statusCode)
    .send({
    // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? message // 'На сервере произошла ошибка'
        : message,
    })
    .end();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
