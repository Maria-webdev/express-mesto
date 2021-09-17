const cardRouter = require('express').Router();
const { cardIdValidation, cardValidation } = require('../middlewares/validation');

const {
    getCards,
    createCard,
    deleteCard,
    likeCard,
    dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', cardValidation, createCard);
cardRouter.delete('/:_id', cardIdValidation, deleteCard);
cardRouter.put('/:_id/likes', cardIdValidation, likeCard);
cardRouter.delete('/:_id/likes', cardIdValidation, dislikeCard);

module.exports = cardRouter;