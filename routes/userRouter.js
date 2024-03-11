const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/signup')
  .post(
    userController.uploadUserPhoto,
    userController.resizeUserPhotoSignUp,
    authController.signup
  );
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.use(authController.protect);
router.route('/updateMyPassword').patch(authController.updatePassword);
router.route('/deleteMe').delete(userController.deleteMe);
router.route('/me').get(userController.getMe, userController.getUser);
router
  .route('/updateMe')
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  );

router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUser);
router
  .route('/create-user')
  .post(
    userController.uploadUserPhoto,
    userController.resizeUserPhotoSignUp,
    userController.createNewUser
  );
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
