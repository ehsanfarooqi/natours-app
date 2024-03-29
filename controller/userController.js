const multer = require('multer');
const sharp = require('sharp');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Email = require('../utils/email');

// create JWT
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create and send Token
const createAndSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWI_COOKIE_EPIRES_IN * 20 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// The disk storage engine gives you full control on storing files to disk.

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);// If we use resize image we must use this
//   },
// });

const multerStorage = multer.memoryStorage();

// This function to control which files should be uploaded.
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Pleasw upload an image', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

// This Middleware function is for resize image on update user data.
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-$${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// Resize user photo on signUp
exports.resizeUserPhotoSignUp = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.body.photo = `user-${req.params.id}-$${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.body.photo}`);

  next();
});

// This function filltered the fields, which fields can user updated on (updateMe) function
const fillterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Get Current user data
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

// Update current user data
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user posted password data or user want to update password and confrinmPassword
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password update. Pleasw use /updateMyPassword',
        400
      )
    );
  }
  // 2) Filtered out unwanted fields name that are not allowed to be update
  const filteredBody = fillterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

// Delte current user data but not from DB just not active the user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createNewUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires: req.body.passwordResetExpires,
  });

  const url = `${req.protocol}://${req.get('host')}/me`; // Access to the url from email to change photo
  new Email(newUser, url).sendWelcome();

  createAndSendToken(newUser, 201, req, res);
});

exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
