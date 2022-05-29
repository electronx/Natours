const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.postUsers);
router
  .route('/:id?')
  .patch(userController.patchUsers)
  .delete(userController.deleteUsers)
  .get(userController.getUsers);

module.exports = router;
