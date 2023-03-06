const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/;

router.get('/', getMovies);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .pattern(regex),
      trailer: Joi.string()
        .required()
        .pattern(regex),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string()
        .required()
        .pattern(regex),
      movieId: Joi.number().required(),
    }),
  }),
  createMovie,
);

router.delete(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovieById,
);

module.exports = router;
