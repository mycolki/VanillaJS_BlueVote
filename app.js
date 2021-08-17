require('dotenv').config();
require('./config/database');
require('./config/passport');

const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

const session = require('express-session');
const passport = require('passport');

const logger = require('morgan');
const path = require('path');

const main = require('./routes/main');
const login = require('./routes/login');
const signUp = require('./routes/signUp');
const votings = require('./routes/votings');

const app = express();

app.use(
  session({
    secret: process.env.SECRET_COOKIE_ID,
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60,
    },
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.SECRET_COOKIE_ID));

const { showLoginPageNotLoginUser, showMainPageLoginUser } = require('./routes/middlewares/authenticateLogin');

app.use('/signUp', showMainPageLoginUser, signUp);
app.use('/login', showMainPageLoginUser, login);
app.use('/', showLoginPageNotLoginUser, main);
// app.use('/votings', showLoginPageNotLoginUser, votings);
app.use('/votings', votings);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
