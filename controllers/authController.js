/* eslint-disable arrow-body-style */
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
// const { User } = require('../routes/userRoutes');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  const newUser = await User.create(req.body);
  //create URL variable according to the enviorenemnt
  const url = `${req.protocol}://${req.get('host')}/me`;

  await new Email(newUser, url).sendWeclome();
  //   {
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  //   passwordChangedAt: req.body.passwordChangedAt,
  // }
  createSendToken(newUser, 201, req, res);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // 1) check if email and password exist
  if (!email || !password) {
    return next(new AppError('please provide email and password!', 400));
  }
  // 2) check if the user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  // 3) if everything is ok, send token to client
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }
  createSendToken(user, 200, req, res);
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
  // 1) getting token and check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token && !(process.env.NODE_ENV === 'production'))
    return next(
      new AppError('You are not logged in, please log in to get access', 401)
    );
  // // 2) validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new AppError('The user does not exist anymore', 401));

  // 4) check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(new AppError('User recently changed the password', 401));

  // GRANT ACESS TO PROTECTED ROUTE
  req.user = currentUser;
  // Gives all templates/pugs access to currentUser
  res.locals.user = currentUser;
  next();
};

// Only for render pages, there will be no errors!
exports.isLoggedIn = async (req, res, next) => {
  // 1) getting token and check if it is there

  if (req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;

      // // 2) validate token
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      // 3) check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      // 4) check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) return next();

      // There is a logged in user
      res.locals.user = currentUser;
      return next();
    } catch (err) {}
  }
  next();
};
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perfrom this action', 403)
      );

    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('there is no user with email address', 404));
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) send it to user's email

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.PasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email, Try again later')
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  // 1) get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) if token has not expired, and there is user ser the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changedPasswordAt property for the user

  // 4) log the user in, send JWT
  createSendToken(user, 200, req, res);
};

exports.updatePassword = async (req, res, next) => {
  // 1) Get usr from the collection
  const { password, newPassword, passwordConfirm } = await req.body;

  const user = await User.findById(req.user.id).select('+password');
  // 2) check if POSTed password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Old password is not correct', 401));
  }

  if (passwordConfirm !== newPassword) {
    return next(
      new AppError('Confirmed password does not match the new password', 401)
    );
  }

  if (password === newPassword)
    return next(
      new AppError('New password must be different from the old password', 401)
    );

  // 3) if so, update the passwrd
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPassword;

  await user.save();
  // 4) log user in, send JWT
  createSendToken(user, 200, req, res);
};
