const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

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
  res.status(200).json({
    status: 'succeess',
    data: {
      data: 'This user not defindes. Pleas use Sign Up!',
    },
  });
});
exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
