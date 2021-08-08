const Card = require('../models/card');

module.exports.getCards = (req, res) => {
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
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден' });
    });
};

module.exports.deleteCard = (req, res) => {
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
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден' });
    });
};

module.exports.likeCard = (req, res) => {
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
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден' });
    });
};

module.exports.dislikeCard = (req, res) => {
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
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден' });
    });
};
