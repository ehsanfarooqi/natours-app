const express = require('express');
const viewController = require('../controller/viewCotroller');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/').get(viewController.getOverview);
router.route('/tour/:slug').get(authController.protect, viewController.getTour);
router.route('/login').get(viewController.getLoginForm);

module.exports = router;
