const multer = require('multer');
const sharp = require('sharp');

const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const alert = req.query.alert;
  if (alert === 'booking')
    res.locals.alert =
      'Your booking was successfully! Please check your email for confirmation. If your booking does not shoe up here immediatly, Please com back later.';
  next();
};

// Upload User Photo
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimeytype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('This is not images! Please upload image.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

// Resize user photo
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.body.photo = `user-${req.params.id}-${Date.now}.jpeg`;
  await sharp(req.files.photo.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.body.photo}`);

  next();
});

// Get Home page
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get All Overviews from documment
  const tours = await Tour.find();

  // 2) Render The template

  // 3) Send response to clinte
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

// Get tour by slug
exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requisted tour (including review and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('Ther is no tour with that name.', 404));
  }
  // 2) build template
  // 3) Render template usin data from 1)
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com https://js.stripe.com/v3/;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://js.stripe.com/v3/ https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: `${tour.name} tour`,
      tour,
    });
});

// User login view
exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'login to your acount',
  });
});

// New user sign up view
exports.getSignUpForm = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign Up to Natours App',
  });
});

// User acount views
exports.getAcount = (req, res) => {
  res.status(200).render('acount', {
    title: 'Your Acount',
  });
};

// Get Tours booked
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all booking
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Finds tours with the returned IDs
  const tourIDs = await bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  // 3) Response the booming tours for current user
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

// User data views
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('acount', {
    title: 'Your Acount',
    user: updateUser,
  });
});

// Forgot password view
exports.getForgotPassForm = catchAsync(async (req, res, next) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot password',
  });
});

// Reset password view
exports.getResetPassForm = catchAsync(async (req, res, next) => {
  const token = req.params.token;

  res.status(200).render('resetPassword', {
    title: 'Reset your password',
    token,
  });
});

// Manage Tours Page
exports.getMangeTour = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('manageTours', {
    title: 'Manage Tours',
    tours,
  });
});

exports.getManageUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).render('manageUsers', {
    title: 'Manage Users',
    users,
  });
});

exports.createNewUser = catchAsync(async (req, res, next) => {
  res.status(201).render('addNewUser', {
    title: 'Add New User',
  });
});

exports.editUserData = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  console.log(user);
  res.status(200).render('editUser', {
    title: 'Edit User Data',
    user,
  });
});
