const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config({ path: './config/config.env' });

const app = require('./app');

// 1) CONNECT TO DB
connectDB();

// 2) START SERVER
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
