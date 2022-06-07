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
  res.status(200);
  res
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com; base-uri 'self'; block-all-mixed-content; font-src 'self' https:; frame-ancestors 'self'; img-src 'self' blob: data:; object-src 'none'; script-src 'unsafe-inline' https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob:; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests;"
    )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
};
