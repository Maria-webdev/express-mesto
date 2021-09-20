const Card = require('../models/card');
const Forbidden = require('../errors/forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        res.status(404).send('Нет пользователя с таким id');
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        res.status(400).send('Переданы некорректные данные');
      } else {
        next(err);
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
        res.status(400).send('Переданы некорректные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const id = req.user._id;
  Card.findById(req.params._id)
    .then((card) => {
      if (!card) {
        res.status(404).send('Нет карточки с таким id');
        return;
      }
      if (card.owner.toString() !== id) {
        throw new Forbidden('Нет доступа для удаления карточки');
      } else {
        card.remove();
        res.send('deleted');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('Переданы некорректные данные');
      } else {
        next(err);
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
        res.status(404).send('Нет пользователя с таким id');
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        res.status(400).send('Переданы некорректные данные');
      } else {
        next(err);
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
        res.status(404).send('Нет карточки с таким id');
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send('Переданы некорректные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};
