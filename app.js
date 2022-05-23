const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log('I am middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`)
);
//--------------------------------------------------------
const getTours = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: '404',
    });
  }

  const tour = tours.find((el) => el.id === id);
  console.log(tour);

  res.status(200).json({
    status: 'success',

    data: {
      tour,
    },
  });
};
//--------------------------------------------------------
const getAllTours = (req, res) => {
  console.log(req.requestTime);
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
const postTours = (req, res) => {
  //   console.log(req.body);
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
const patchTours = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: '404',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour>',
    },
  });
};
//--------------------------------------------------------
const deleteTours = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: '404',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//--------------------------------------------------------
app.route('/api/v1/tours/').get(getAllTours).post(postTours);

app
  .route('/api/v1/tours/:id?')
  .patch(patchTours)
  .delete(deleteTours)
  .get(getTours);
//--------------------------------------------------------
const port = 3000;
app.listen(port, () => {
  console.log('I am listening');
});
