const mongoose = require('mongoose');

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      // .connect(process.env.DATABASE_LOCAL, {
      useNewUrlParser: true,
    });
    console.log('DB connection successful!');
  } catch (err) {
    console.log(err);
  }
};
