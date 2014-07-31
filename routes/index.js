module.exports = function(connection){
	var express = require('express');
	var router = express.Router();	

	/* GET home page. */
	router.get('/', function(req, res) {
		
		connection.query('SELECT * from photos order by id ', function(err, rows, fields) {
		if (err) throw err;
			res.render('index', { title: 'GloboJS',  data: rows});
		});

	});

	return router;
}