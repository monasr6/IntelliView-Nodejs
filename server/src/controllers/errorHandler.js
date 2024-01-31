const errorDev = (err, req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      me: 'Here from error handler controller',
      message: err.message,
      stack: err.stack,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    me: 'Here from error handler controller',
    msg: err.message,
  });
};

const errorProd = (err, req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        me: 'Here from error handler controller',
        status: err.status,
        message: err.message,
      });
    }
    // console.error('ERROR 💥', err);
    return res.status(500).json({
      me: 'Here from error handler controller',
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      me: 'Here from error handler controller',
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  // console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    me: 'Here from error handler controller',
    title: 'Something went wrong',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    errorDev(err, req, res, next);
  } else if (process.env.NODE_ENV === 'production') {
    errorProd(err, req, res, next);
  }
};
