const express = require('express');
const viewController = require('../controller/viewCotroller');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/').get(authController.isLoggedIn, viewController.getOverview);

router
  .route('/tour/:slug')
  .get(authController.isLoggedIn, viewController.getTour);

router
  .route('/login')
  .get(authController.isLoggedIn, viewController.getLoginForm);

router.route('/signup').get(viewController.getSignUpForm);
router.route('/me').get(authController.protect, viewController.getAcount);

router
  .route('/submit-user-data')
  .post(authController.protect, viewController.updateUserData);

module.exports = router;
