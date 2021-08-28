const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

const cardsRouter = require('./routes/cards');
const userRouter = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

app.use((req, res, next) => {
    req.user = {
        _id: '610a8ababf721b09701cc7ef',
    };
    next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/cards', cardsRouter);
app.use('/users', userRouter);
app.use('*', (req, res) => {
    res.status(404).send({ message: 'ресурс не найден.' });
});

app.use(auth);

mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});