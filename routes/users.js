const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  // getUsers,
  getCurrentUser,
  // getUserById,
  updateUser,
  // updateAvatar,
} = require('../controllers/users');

// router.get('/', getUsers);
router.get('/me', getCurrentUser);
// router.get(
//   '/:userId',
//   celebrate({
//     params: Joi.object().keys({
//       userId: Joi.string().length(24).hex().required(),
//     }),
//   }),
//   getUserById,
// );

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().min(2).max(30).required()
        .email(),
    }),
  }),
  updateUser,
);

module.exports = router;
