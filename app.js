var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
mysql      = require('mysql');

// Application initialization
var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : ''
    });

// Database setup
connection.query('CREATE DATABASE IF NOT EXISTS SlideShow', function (err) {
    if (err) throw err;
    connection.query('USE SlideShow', function (err) {
        if (err) throw err;
        connection.query('CREATE TABLE IF NOT EXISTS photos('
            + 'id INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(id),'
            + 'title VARCHAR(50)'
            + 'description VARCHAR(255)'
            + 'path VARCHAR(255)'
            +  ')', function (err) {
                if (err) throw err;
            });
    });
});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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


module.exports = app;
