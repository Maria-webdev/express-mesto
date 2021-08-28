const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
    Card.find({})
        .then((card) => {
            if (!card) {
                res.status(404).send({ message: 'Нет пользователя с таким id' });
                return;
            }
            res.send(card);
        })
        .catch((err) => {
            if (err.message === 'CastError') {
                res.status(400).send({ message: 'Переданы некорректные данные' });
            }
        })
        .catch(next);
};

module.exports.createCard = (req, res, next) => {
    const { name, link } = req.body;
    Card.create({ name, link, owner: req.user._id })
        .then((card) => {
            res.status(200).send(card);
        })
        .catch((err) => {
            if (err.message === 'CastError') {
                res.status(400).send({ message: 'Переданы некорректные данные' });
            }
        })
        .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
    Card.findByIdAndRemove(req.params._id)
        .then((card) => {
            if (!card) {
                res.status(404).send({ message: 'Нет пользователя с таким id' });
                return;
            }
            res.send(card);
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                res.status(400).send({ message: 'Переданы некорректные данные' });
            }
        })
        .catch(next);
};

module.exports.likeCard = (req, res, next) => {
    Card.findByIdAndUpdate(
            req.params._id, {
                $addToSet: { likes: req.params._id },
            }, { new: true },
        )
        .then((card) => {
            if (!card) {
                res.status(404).send({ message: 'Нет пользователя с таким id' });
                return;
            }
            res.send(card);
        })
        .catch((err) => {
            if (err.message === 'CastError') {
                res.status(400).send({ message: 'Переданы некорректные данные' });
            }
        })
        .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
    Card.findByIdAndUpdate(
            req.params._id, {
                $pull: { likes: req.params._id },
            }, { new: true },
        )
        .then((card) => {
            if (!card) {
                res.status(404).send({ message: 'Нет пользователя с таким id' });
                return;
            }
            res.send(card);
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                res.status(400).send({ message: 'Переданы некорректные данные' });
            }
            if (err.name === 'NotFound') {
                res.status(404).send({ message: 'Карточки с таким id не найдены' });
            }
        })
        .catch(next);
};