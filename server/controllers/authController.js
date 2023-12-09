const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/User');

const catchAsync = require('../utils/catchAsync');

const signToken = (id) =>
  jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  // 1- Get user data from the body
  const { name, email, password, passwordConfirm } = req.body;
  // 2- Create a new user document
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  const token = signToken(newUser._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    // secure: true,
    httpOnly: true,
  });
  // 3- Send back the new user document
  res.status(201).json({
    status: 'success',
    data: {
      token,
    },
  });
});

exports.login = (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
};

exports.forgotPassword = (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
};
