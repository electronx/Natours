const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.postTours);
router
  .route('/:id?')
  .patch(tourController.patchTours)
  .delete(tourController.deleteTours)
  .get(tourController.getTours);

module.exports = router;
