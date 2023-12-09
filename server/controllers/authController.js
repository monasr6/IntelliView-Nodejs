const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/User');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  // 1- Get user data from the body
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    return next(new Error('Please provide all the required fields!', 400));
  }
  // 2- Create a new user document
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  if (!newUser) {
    return next(new AppError('Error creating user', 500));
  }
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
  const { email, password } = req.body;
  // 1- Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2- Check if user exists && password is correct
  const currentUser = User.findOne({ email });

  if (!currentUser || !currentUser.correctPassword(password)) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3- If everything ok, send token to client
  const token = signToken(currentUser._id);
  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
};

exports.forgotPassword = (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
};
