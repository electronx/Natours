const User = require('../models/userModel');

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(500).json({
    status: 'success',
    data: {
      users,
    },
  });
};

exports.getUsers = async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.postUsers = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.deleteUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.patchUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
