var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var jwt = require('express-jwt');

//dotenv.load();

var routes = require('./routes/index');
var user = require('./routes/user');

// This will configure Passport to use Auth0
var strategy = new Auth0Strategy({
    domain:       'moneymoney.auth0.com',
    clientID:     'epRgjVF15vGKLJEL8EjVGV241IImwDW2',
    clientSecret: 'oVjlNrZ4KfEyBbhinzY-bfEjRJPz4kBtGLS4Tb60Re94opTsfxs_jFuLSWZnx705',
    callbackURL:  'moneymoney.zapto.org/callback'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

var jwtCheck = jwt({
  secret: new Buffer('oVjlNrZ4KfEyBbhinzY-bfEjRJPz4kBtGLS4Tb60Re94opTsfxs_jFuLSWZnx705', 'base64'),
  audience: 'epRgjVF15vGKLJEL8EjVGV241IImwDW2'
});

passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'b4943ng34g93n4230gn234v284nb34gkbyg',
  saveUninitialized: true,
  resave: true,
  cookie: {
    httpOnly: true,
    secure: true
  }
}));
app.use('/user/getDataAPI', jwtCheck);
app.use('/user/insertDataAPI', jwtCheck);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', user);

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


app.use(function(req, res, next) {
  if(!req.secure) {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  next();
});


module.exports = app;
