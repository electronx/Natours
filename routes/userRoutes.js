const express = require('express');

const userController = require('./../controllers/userController');

const router = express.Router();

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
