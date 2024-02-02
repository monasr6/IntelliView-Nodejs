const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const User = require('../models/User');

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { id, token } = req.params;
  if (!token || !id) {
    return next(new AppError('Invalid token', 400));
  }
  const currentUser = User.findById(id);
  if (!currentUser) {
    return next(new AppError('Invalid token', 400));
  }
  currentUser.isVerified = true;
  await User.findByIdAndUpdate(id, { isVerified: true });
  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully',
  });
});
