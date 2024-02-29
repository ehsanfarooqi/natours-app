const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globaleErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const viewRouter = require('./routes/viewRouter');
const bookingRouter = require('./routes/bookingRoute');

// Start express app
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// Development loginig
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set security HTTP headers
// app.use(helmet());
app.use(helmet({ contentSecurityPolicy: false }));

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: 'To many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, readin data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization files
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use((req, res, next) => {
  // console.log(req.cookies);
  next();
});

// Routes
app.use('/', viewRouter);
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/bookings', bookingRouter);

// Rout Handler
app.all('*', (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} on thos server`, 404));
});

// Error Handler
app.use(globaleErrorHandler);

// Server Start
module.exports = app;
