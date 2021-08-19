require('dotenv').config();
require('./config/database');
require('./config/passport');

const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override')

const session = require('express-session');
const passport = require('passport');

const logger = require('morgan');
const path = require('path');

const main = require('./routes/main');
const login = require('./routes/login');
const signUp = require('./routes/signUp');
const votings = require('./routes/votings');
const myVotings = require('./routes/myVotings');

const app = express();

app.use(
  session({
    secret: process.env.SECRET_COOKIE_ID,
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(cookieParser(process.env.SECRET_COOKIE_ID));
app.use(methodOverride('_method'))
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const { redirectLoginNotLoggedIn, redirectMainLoggedIn } = require('./routes/middlewares/authenticateLogin');

app.use('/signUp', redirectMainLoggedIn, signUp);
app.use('/login', redirectMainLoggedIn, login);
app.use('/', redirectLoginNotLoggedIn, main);
app.use('/votings', redirectLoginNotLoggedIn, votings);
app.use('/myVoting', redirectLoginNotLoggedIn, myVotings);

app.use(function (req, res, next) {
  next(createError(404, 'Not Found Page'));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res
    .status(err.status || 500)
    .render('error', {
      status: err.status || 500,
      message: err.message,
      stack: err.stack || '',
    });
});

module.exports = app;
