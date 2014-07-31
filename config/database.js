exports.connection = function(){

	var mysql = require('mysql');

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
	            });
	    });
	});

}