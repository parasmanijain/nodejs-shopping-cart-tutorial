import express, { json, urlencoded, static as express_static } from 'express';
import { join } from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import expressHbs from 'express-handlebars';
import { connect } from 'mongoose';
import session from 'express-session';
import { initialize, session as _session } from 'passport';
import flash from 'connect-flash';
import validator from 'express-validator';

import routes from './routes/index';
import userRoutes from './routes/user';

var app = express();

connect('localhost:27017/shopping');
import './config/passport';

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({secret: 'mysupersecret', resave: false, saveUninitialized: false}));
app.use(flash());
app.use(initialize());
app.use(_session());
app.use(express_static(join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});

app.use('/user', userRoutes);
app.use('/', routes);

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


export default app;
