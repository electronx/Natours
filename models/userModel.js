const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name must be provided'],
      minLength: 3,
      maxLength: 15,
    },
    email: {
      type: String,
      required: [true, 'Email must be provided'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail],
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'lead-guide', 'guide'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please choose the password'],
      minLength: 8,
      maxLength: 20,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        //this only works on .CREATE and .SAVE!!!
        validator: function (val) {
          return this.password === val;
        },
        message: 'passwords are not the same',
      },
    },
    passwordChangedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the passwrod with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete password Confirm field
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// eslint-disable-next-line new-cap
const User = new mongoose.model('User', userSchema);

module.exports = User;
