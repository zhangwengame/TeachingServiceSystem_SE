var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var busboy = require('connect-busboy');
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var session = require('express-session');
var passport = require('passport');

var initP = require('./initPassport');


var app = express();

var settings = require('./settings');

//NOTE: use mongoose.connect insteadof mongoose.createConnection
mongoose.connect(settings.db.connect);

//NOTE: These routes requires must be placed after mongoose.connect
var routes = require('./routes/index');
var users = require('./routes/users');
var debug = require('./routes/debug');

//this method deprecated, please refer to NOTE
//global.db       = mongoose.createConnection(settings.db.connect);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(busboy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'gg',
    key: 'gg',
    cookie: {
        maxAge: 200000
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next();
});
app.use('/', routes);
app.use('/users', users);
app.use('/debug', debug);

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
 app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
     message: err.message,
     error: err
   });
 });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
   message: err.message,
   error: {}
 });
});

initP(passport);
module.exports = app;
