const express = require('express');
const viewController = require('../controller/viewCotroller');
const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController');
const { route } = require('./reviewRouter');

const router = express.Router();
router.use(viewController.alerts);
router.route('/').get(authController.isLoggedIn, viewController.getOverview);
router
  .route('/tour/:slug')
  .get(authController.isLoggedIn, viewController.getTour);
router
  .route('/login')
  .get(authController.isLoggedIn, viewController.getLoginForm);
router.route('/signup').get(viewController.getSignUpForm);
router.route('/me').get(authController.protect, viewController.getAcount);
router.route('/forgotPassword').get(viewController.getForgotPassForm);
router.route('/resetPassword/:token').get(viewController.getResetPassForm);
router
  .route('/my-tours')
  .get(authController.protect, viewController.getMyTours);
router
  .route('/submit-user-data')
  .post(authController.protect, viewController.updateUserData);

router
  .route('/manage-tours')
  .get(authController.protect, viewController.getMangeTour);

module.exports = router;
