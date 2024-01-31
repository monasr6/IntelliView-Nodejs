const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.veriftEmail = catchAsync(
  async (req, res, next) => new AppError('Not implemented yet', 501),
);
