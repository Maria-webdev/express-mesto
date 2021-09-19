const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotAuthError = require('../errors/not-auth');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/not-found');

module.exports.getUsers = (req, res, next) => {
    User.find({})
        .then((users) => res.send(users))
        .catch((err) => {
            if (err.name === 'CastError') {
                res.status(400).send('Переданы некорректные данные');
            }
        })
        .catch(next);
};

module.exports.getUser = (req, res, next) => {
    User.findById(req.params._id)
        .then((user) => {
            if (!user) {
                throw new NotFoundError('Нет пользователя с таким id');
            }
            res.send(user);
        })
        .catch((err) => {
            if (err.message === 'NotValidId') {
                res.status(404).send('Пользователь не найден');
            }
            if (err.name === 'CastError') {
                res.status(400).send('Переданы некорректные данные');
            }
        })
        .catch(next);
};

module.exports.createUser = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                throw new ConflictError('Пользователь с таким email уже существует');
            } else {
                return bcrypt.hash(req.body.password, 10);
            }
        })
        .then((hash) => User.create({
            name: req.body.name,
            about: req.body.about,
            avatar: req.body.avatar,
            email: req.body.email,
            password: hash,
        }))
        .then((newUser) => res.status(200).send({
            name: newUser.name,
            about: newUser.about,
            avatar: newUser.avatar,
            email: newUser.email,
        }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                throw new BadRequestError(err.mesage);
            }
        })
        .catch(next);
};

module.exports.updateUser = (req, res, next) => {
    const { name, about } = req.body;
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
        .orFail(new Error('NotValidId'))
        .then((user) => res.send(user))
        .catch((err) => {
            if (err.message === 'NotValidId') {
                res.status(404).send('Пользователь не найден');
            }
            if (err.name === 'CastError') {
                res.status(400).send('Переданы некорректные данные');
            }
        })
        .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
    const { avatar } = req.body;
    return User.findByIdAndUpdate(req.params._id, { avatar }, { new: true, runValidators: true })
        .then((user) => res.send(user))
        .catch((err) => {
            if (err.message === 'NotValidId') {
                res.status(404).send('Пользователь не найден');
            }
            if (err.name === 'CastError') {
                res.status(400).send('Переданы некорректные данные');
            }
        })
        .catch(next);
};

module.exports.login = (req, res, next) => {
    const { email, password } = req.body;
    const { JWT_SECRET = 'super-strong-secret' } = process.env;
    return User.findUserByCredentials(email, password)
        .then((user) => {
            const token = jwt.sign({
                    _id: user._id,
                },
                JWT_SECRET, {
                    expiresIn: '7d',
                });
            return res.send({ token });
        })
        .catch((err) => {
            throw new NotAuthError(err.message);
        })
        .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
    User.findById(req.user._id)
        .then((user) => {
            if (!user) {
                throw new NotFoundError('Нет пользователя с таким id');
            }
            res.send(user);
        })
        .catch((err) => {
            if (err.message === 'NotValidId') {
                res.status(404).send('Пользователь не найден');
            }
            if (err.name === 'CastError') {
                res.status(400).send('Переданы некорректные данные');
            }
        })
        .catch(next);
};

module.exports.signout = (req, res) => {
    res.clearCookie('jwt').send('cookies deleted');
};