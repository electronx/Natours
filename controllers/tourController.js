const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(val);
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: '404',
      message: 'invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  console.log(req);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing name or price',
    });
  }
  next();
};

exports.getTours = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',

    data: {
      tour,
    },
  });
};
//--------------------------------------------------------

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requested: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};
//--------------------------------------------------------
exports.postTours = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/starter/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
//--------------------------------------------------------
exports.patchTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour>',
    },
  });
};
//--------------------------------------------------------
exports.deleteTours = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
