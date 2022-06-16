const express = require('express');
// eslint-disable-next-line import/extensions
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.use(authController.isLoggedIn);

router.get(
  '/',
  // bookingController.createBookingCheckout,
  viewsController.getOverview
);
router.get('/tour/:slug', viewsController.getTour);
router.get('/login', viewsController.getLogin);

module.exports = router;
