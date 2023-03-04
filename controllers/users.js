require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/badRequestErr');
const NotFoundError = require('../errors/notFoundErr');
const RequestConflictError = require('../errors/requestConflictErr');

const {
  SUCCESS,
} = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Отсутствует email или пароль'));
  }
  bcrypt
    .hash(password, saltRounds)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(SUCCESS).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new RequestConflictError('Пользователь уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

// для проекта
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден');
      }
      res.status(SUCCESS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный Id'));
      } else {
        next(err);
      }
    });
};

// для проекта
module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(SUCCESS).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Передан некорректный запрос'));
      } else if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Отсутствует email или пароль'));
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Передан некорректный запрос'));
      } else {
        next(err);
      }
    });
};
