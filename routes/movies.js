const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovieById,
  // likeCard,
  // dislikeCard,
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
      year: Joi.string().required().min(4).max(4),
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
      movieId: Joi.string().length(24).hex().required(), // positive().integer()???
    }),
  }),
  createMovie,
);

router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovieById,
);

// router.put(
//   '/:cardId/likes',
//   celebrate({
//     params: Joi.object().keys({
//       cardId: Joi.string().length(24).hex().required(),
//     }),
//   }),
//   likeCard,
// );

// router.delete(
//   '/:cardId/likes',
//   celebrate({
//     params: Joi.object().keys({
//       cardId: Joi.string().length(24).hex().required(),
//     }),
//   }),
//   dislikeCard,
// );

module.exports = router;
