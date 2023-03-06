const BadRequestError = require('../errors/badRequestErr');
const NotFoundError = require('../errors/notFoundErr');
const ForbiddenError = require('../errors/forbiddenErr');
const Movie = require('../models/movie');
const { SUCCESS, CREATED } = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(SUCCESS).send(movies);
    })
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((movie) => res.status(CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Передан некорректный запрос'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным id не найден');
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Отсутствуют права на удаление этого фильма');
      }
      movie.remove().then(() => res.send({ message: 'Фильм удален' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный запрос'));
      } else {
        next(err);
      }
    });
};
