const express = require('express');
const mongoose = require('mongoose');

const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const app = express();

const cardsRouter = require('./routes/cards');
const userRouter = require('./routes/users');
const { userLogin, userCreate } = require('./middlewares/validation');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const auth = require('./middlewares/auth');
const { login, createUser, signout } = require('./controllers/users');

app.use(cookieParser());

app.post('/signin', userLogin, login);
app.post('/signup', userCreate, createUser);

app.use(auth);

app.use('/cards', cardsRouter);
app.use('/users', userRouter);

app.delete('/signout', signout);

app.use('*', (req, res) => {
    res.status(404).send('ресурс не найден.');
});

app.use(errors());

app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
        message: statusCode === 500 ? 'серверная ошибка' : message,
    });
    next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});