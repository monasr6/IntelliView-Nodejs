const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');

exports.connectDB = catchAsync(async () => {
  await mongoose.connect(process.env.DATABASE, {
    // .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
  });
  console.log('DB connection successful!');
});
