const express = require('express');
const bookingController = require('../controller/bookingController');
const authController = require('../controller/authController');

const router = express.Router();

router.use(authController.protect);
router
  .route('/checkout-session/:tourId')
  .get(authController.protect, bookingController.getCheckoutSession);
router
  .route('/')
  .get(authController.protect, bookingController.getAllBookings)
  .post(authController.protect, bookingController.createBooking);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
