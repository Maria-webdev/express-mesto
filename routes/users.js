const userRouter = require('express').Router();
const { userInfoValidation, userIdValidation, avatarValidation } = require('../middlewares/validation');

const {
    getUsers,
    getUser,
    updateUser,
    getCurrentUser,
    updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', userInfoValidation, getCurrentUser);
userRouter.patch('/me', userInfoValidation, updateUser);
userRouter.patch('/me/avatar', avatarValidation, updateAvatar);
userRouter.get('/:_id', userIdValidation, getUser);

module.exports = userRouter;