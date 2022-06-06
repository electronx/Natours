const express = require('express');
// eslint-disable-next-line import/extensions
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.getOverview);

router.get('/tours/:slug', viewsController.getTour);

module.exports = router;
