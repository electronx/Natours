const Tour = require('../models/tourModel');

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
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  // 1) get the date, fro the requested tour (including reviews and the tour guides)
  console.log(tour);
  // 2) build template

  // 3) render tempalte using data from step 1
  res.status(200).render('tour', {
    title: 'The Game Changer',
    data: {
      tour,
    },
  });
};
