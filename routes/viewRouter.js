const express = require('express');
const viewController = require('../controller/viewCotroller');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router
  .route('/signup')
  .get(viewController.getSignUpForm, userController.uploadUserPhoto);

router.use(authController.isLoggedIn);

router.route('/').get(viewController.getOverview);
router.route('/tour/:slug').get(viewController.getTour);
router.route('/login').get(viewController.getLoginForm);

module.exports = router;
