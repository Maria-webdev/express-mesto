const user = require('../models/user');

module.exports.getUsers = (req, res) => {
  user.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Запрашиваемый ресурс не найден' }));
};

module.exports.getUser = (req, res) => {
  user.findById(req.params._id)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      }
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  user.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      }
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  user.findByIdAbdUpdate(req.params._id, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      }
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  user.findByIdAbdUpdate(req.params._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      }
      res.status(500).send({ message: 'Запрашиваемый ресурс не найден' });
    });
};
