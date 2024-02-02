const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/User');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/emailSender');

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
  // send email to verify account
  const verificationToken = newUser.createEmailVerificationToken();
  await newUser.save({ validateBeforeSave: false });

  const verificationURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/verifyEmail/${verificationToken}`;

  await new Email(newUser).sendVerifyEmail(verificationURL);

  // 3- Send back the new user document
  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1- Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2- Check if user exists && password is correct
  const currentUser = await User.findOne({ email }).select('+password');

  if (
    !currentUser ||
    !(await currentUser.correctPassword(password, currentUser.password))
  ) {
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
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() - 1000),
    // secure: true,
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  // 1- Get user based on POSTed email
  const currentUser = User.findOne({ email });
  if (!currentUser) {
    return next(new AppError('There is no user with email address.', 404));
  }
  // 2- Generate the random reset token
  const resetToken = currentUser.getResetToken();

  await currentUser.save({ validateBeforeSave: false });
  // convert email to base64 string
  const encodedEmail = Buffer.from(email).toString('base64');

  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/resetPassword/${encodedEmail}/${resetToken}`;

  // 3- Send it to user's email
  res.status(200).json({
    status: 'success',
    data: {
      resetURL,
    },
  });
});

exports.resetPassword = (req, res, next) => {
  // 1- Get user based on the token
  const { email, resetToken } = req.params;

  const decodedEmail = Buffer.from(email, 'base64').toString('ascii');

  const currentUser = User.findOne({ email: decodedEmail });

  if (
    !currentUser ||
    !currentUser.passwordResetToken ||
    !currentUser.comparePasswordResetToken(resetToken)
  ) {
    return next(new AppError('Invalid token', 400));
  }
  // 2- If token has not expired, and there is user, set the new password
  if (!currentUser.passwordResetExpires > Date.now()) {
    return next(new AppError('Token has expired', 400));
  }

  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm || password !== passwordConfirm) {
    return next(new AppError('Please provide all the required fields!', 400));
  }

  currentUser.password = password;
  currentUser.passwordConfirm = passwordConfirm;
  currentUser.passwordResetToken = undefined;
  currentUser.passwordResetExpires = undefined;

  currentUser.save();
  // 4- Log the user in, send JWT
  const token = signToken(currentUser._id);
  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
};
