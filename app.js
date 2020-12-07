var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sess_config = require('./config/session.js');

var app = express();

// Router
var homeRouter = require('./routes/home');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var trainingRouter = require('./routes/training');
var roomRouter = require('./routes/room');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(sess_config.init());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(request, response, next){
  if(request.session.loggedin == true){
    response.locals.username = request.session.username;
    console.log("세션");
  }
  next();
})

// Routes
app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/training', trainingRouter);
app.use('/room', roomRouter);


// app.use(function(request, response, next){
//   response.locals.currentUser = request.session.username;
// })


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
