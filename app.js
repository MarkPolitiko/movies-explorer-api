/* eslint-disable import/no-extraneous-dependencies */
// require('dotenv').config();

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
// const MONGO_URL = require('./utils/config');
const { limiter } = require('./middlewares/limiter');
const routes = require('./routes/index');
const config = require('./utils/config');
// const rateLimit = require('express-rate-limit');

// const { loginUser, createUser /* unauthorized */ } = require('./controllers/users');
// const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const { NODE_ENV, MONGO_URL } = process.env;

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
// });
// const NotFoundError = require('./errors/notFoundErr');
const errorHandler = require('./errors/errHandler');

// const { PORT = 3000, DB_URL = MONGO_URL } = process.env;
const app = express();

mongoose.set('strictQuery', false);
// mongoose.connect(DB_URL, {
//   useNewUrlParser: true,
// });
// mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb');

// console.log(process.env.NODE_ENV);
mongoose.connect(config.MONGODB_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger); // подключаем логгер запросов

app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(bodyParser.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// app.post(
//   '/signin',
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().required().email(),
//       password: Joi.string().required().min(8),
//     }),
//   }),
//   loginUser,
// );

// app.post(
//   '/signup',
//   celebrate({
//     body: Joi.object().keys({
//       name: Joi.string().min(2).max(30),
//       email: Joi.string().required().email(),
//       password: Joi.string().required().min(8),
//     }),
//   }),
//   createUser,
// );

// app.post('/signout', unauthorized);

// app.use(auth);

// app.use('/users', require('./routes/users'));
// app.use('/movies', require('./routes/movies'));

// app.use('*', (req, res, next) => {
//   next(new NotFoundError('Страница не найдена'));
// });

app.use('/', routes);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`App listening on port ${config.PORT}`);
});
