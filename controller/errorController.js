const AppError = require('../utils/appError');

const handleExpireInError = () => {
  new AppError('Your token has expires! Please log in again', 401);
};

const handleJWTError = () => {
  new AppError('Invalid token, Pleasw log in again', 401);
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};

const handelDuplicateFieldsDB = err => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value * ${value} *. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const error = Object.values(err.errors).map(el => el.message);
  const message = `Onvalid input data ${error.join('.')}`;
  return new AppError(message, err);
};

// Send Error for Development
const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // B) Renderd Website
  return res.status(err.statusCode).render('error', {
    title: 'Somting went wrong',
    msg: err.message,
  });
};

// Send Error for Production
const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // Oprerational, trusted error: send message to clint
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // programming or other unkown error: don't leak error details
    }
    // 1) Log Error
    console.log('ERROR ❤️‍🔥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'fail',
      message: 'Somthing went very wrong!',
    });
  }
  // B) Rendered Website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Somthing went wrong',
      msg: err.message,
    });
    // programming or other unkown error: don't leak error details
  }
  // 1) Log Error
  console.log('ERROR ❤️‍🔥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'somthing went wrong',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handelDuplicateFieldsDB(error);
    // This error handle function not working ***
    if (error.name === 'ValidatorError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleExpireInError();

    sendErrorProd(error, req, res);
  }
};
