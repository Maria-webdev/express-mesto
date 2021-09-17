const userRouter = require('express').Router();
const { userInfoValidation, userIdValidation, avatarValidation } = require('../middlewares/validation');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:_id', userIdValidation, getUser);
userRouter.post('/', userInfoValidation, createUser);
userRouter.patch('/me', userInfoValidation, updateUser);
userRouter.patch('/me/avatar', avatarValidation, updateAvatar);

module.exports = userRouter;
