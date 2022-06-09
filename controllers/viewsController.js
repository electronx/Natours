const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const appError = require('../utils/appError');

exports.getOverview = async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) BUild template

  // 3) render that tempalte using tour data from step 1

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
};

exports.getTour = async (req, res, next) => {
  // 1) get the date, fro the requested tour (including reviews and the tour guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 400));
  }

  // 2) build template

  // 3) render tempalte using data from step 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
};

exports.getLogin = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};
