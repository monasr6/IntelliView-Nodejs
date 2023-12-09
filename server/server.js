const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

// 1) CONNECT TO DB

const connectToDB = async () => {
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

connectToDB();

// 2) START SERVER
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
