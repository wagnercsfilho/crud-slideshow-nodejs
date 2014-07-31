var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mysql = require('mysql');

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
            + 'title VARCHAR(50),'
            + 'description VARCHAR(255),'
            + 'path VARCHAR(255)'
            +  ')', function (err) {
                if (err) throw err;
                connection.query('DELETE from photos', 
                function (err) {
                    if (err) throw err;
                        connection.query("INSERT INTO photos (id, title, description, path) VALUES"
                                        +"(1, 'SERA MESMO?', 'Cora confirma para Cristina que Zé é o pai da jovem', 'slide01.jpg'),"
                                        +"(2, 'NA GRAVAÇÃO DO ESTRELAS', 'Angélica se encanta com filhas recém-nascidas de sertanejos ', 'slide02.jpg'),"
                                        +"(7, 'MEU PEDACINHO DE CHÃO', 'Elenco grava casamento do último capítulo: veja fotos!', '86f44240-1881-11e4-80e6-db8d0d8f9d52_slide03.jpg');", 
                            function (err) {
                            if (err) throw err;
                        });
                });
            });
    });
});

var routes = require('./routes/index')(connection);
var admin = require('./routes/admin')(connection);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/admin', admin);

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

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});


module.exports = app;
