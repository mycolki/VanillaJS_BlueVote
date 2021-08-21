const { validationResult } = require('express-validator');
const createError = require('http-errors');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../../models/User');

const { SERVER_ERROR } = require('../../constants/errorMessage');
const { VALIDATION } = require('../../constants/uiMessage');
const { ROUTE } = require('../../constants/route');
const VIEW = require('../../constants/view');

exports.viewSignUpPage = function (req, res, next) {
  res.render(VIEW.SIGN_UP);
};

exports.signUpNewUser = async function (req, res, next) {
  if (!req.body) {
    return res.status(400)
      .render(VIEW.SIGN_UP, VALIDATION.EMAIL_PW);
  }

  const { email, password, checkedPassword } = req.body;
  const hashedPassword = await bcryptjs.hash(password, saltRounds);
  const errors = validationResult(req);

  try {
    if (await User.exists({ email })) {
      return res.status(400)
        .render(VIEW.SIGN_UP, VALIDATION.EXIST_EMAIL);
    }
  } catch (err) {
    console.error(err);

    if (err instanceof mongoose.Error.ValidationError) {
      for (field in err.errors) {
        return next(500, err.errors[field].message);
      }
    }

    return next(createError(500, SERVER_ERROR));
  }

  if (!errors.isEmpty()) {
    const invalidInputs = errors.array().map(error => error.param).join(', ');

    return res.status(400)
      .render(VIEW.SIGN_UP, { message: invalidInputs + VALIDATION.MALFORMED_INFO });
  }

  if (password !== checkedPassword) {
    return res.status(400)
      .render(VIEW.SIGN_UP, VALIDATION.NOT_EQUAL_PW);
  }

  try {
    await User.create({
      email,
      password: hashedPassword,
    });
  } catch (err) {
    console.error(err)

    if (err instanceof mongoose.Error.ValidationError) {
      for (field in err.errors) {
        return next(500, err.errors[field].message);
      }
    }

    return next(createError(500, SERVER_ERROR));
  }

  res.redirect(ROUTE.LOGIN);
};
