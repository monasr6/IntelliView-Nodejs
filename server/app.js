const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');

const userRouter = require('./routers/userRouter');

//const userRouter = require('./routes/userRoutes');

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

app.use('api/v1/', userRouter);

module.exports = app;
