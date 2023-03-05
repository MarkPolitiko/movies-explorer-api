const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { allowedParams } = require('./middlewares/cors');
const { limiter } = require('./middlewares/limiter');
const routes = require('./routes/index');
const config = require('./utils/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const errorHandler = require('./errors/errHandler');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(config.MONGODB_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger); // подключаем логгер запросов

app.use(helmet());
app.use(limiter);
app.use('*', cors(allowedParams));
app.use(bodyParser.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', routes);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`App listening on port ${config.PORT}`);
});
