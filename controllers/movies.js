const BadRequestError = require('../errors/badRequestErr');
const NotFoundError = require('../errors/notFoundErr');
const ForbiddenError = require('../errors/forbiddenErr');
const Movie = require('../models/movie');
const { SUCCESS, CREATED } = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.status(SUCCESS).send(movies);
    })
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(CREATED).send({ body: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Передан некорректный запрос'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findByIdAndRemove(req.params.movieId)
    .populate(['owner']) // Здесь уточнить
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным id не найден');
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Отсутствуют права на удаление этого фильма');
      }
      res.status(SUCCESS).send(movie);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный запрос'));
      } else {
        next(err);
      }
    });
};
