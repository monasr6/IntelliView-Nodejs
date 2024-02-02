const express = require('express');
const morgan = require('morgan');

const authRouter = require('./routers/authRouter');
const verifyRouter = require('./routers/verifyRouter');

//const authRouter = require('./routes/authRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use('/api/v1/Verify', verifyRouter);
app.use('/api/v1/Auth', authRouter);

module.exports = app;
