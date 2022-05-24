const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
console.log(process.env.NODE_ENV);
//1 MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/starter/public`));
// app.use((req, res, next) => {
//   console.log('I am middleware');
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

//--------------------------------------------------------
//2) Route Handling

// -------------------------users

//--------------------------------------------------------
//Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//--------------------------------------------------------

module.exports = app;
