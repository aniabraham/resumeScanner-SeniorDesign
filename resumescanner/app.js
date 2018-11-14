var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var resume = require('./routes/resume');
var mobile = require('./routes/mobile');
var authentication = require('./routes/authentication');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "resume, Authorization, "
            +"Access-Control-Allow-Origin, Origin, X-Requested-With, "
            +"Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use('/resume', resume);
app.use('/authentication', authentication);
app.use('/mobile', mobile);

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.json(err);
});


module.exports = app;
