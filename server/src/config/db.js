const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');

exports.connectDB = catchAsync(async () => {
  await mongoose.connect(process.env.DATABASE, {});
  console.log('DB connection successful!');
});
