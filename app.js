const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
//1 MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/starter/public`));

//--------------------------------------------------------
//Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//--------------------------------------------------------
//Handling unhandled routes

app.all('*', (req, res, next) => {
  // const err = new Error(`it's not here fooool -> ${req.originalUrl}`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`it's not here fooool -> ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
