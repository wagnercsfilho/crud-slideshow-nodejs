module.exports = function(connection){
	var express = require('express');
	var fs 		= require('fs');
	var multipart = require('connect-multiparty');
	var uuid = require('node-uuid');
	var multipartMiddleware = multipart();
	var router  = express.Router();	

	/* GET home page. */
	router.get('/', function(req, res) {
		
		connection.query('SELECT * from photos', function(err, rows, fields) {
		if (err) throw err;
			res.render('admin/index', { title: 'Admin',  data: rows});
		});

	});

	router.get('/new', function(req, res) {
		
		res.render('admin/new', { title: 'Nova Imagem'});

	});

	router.get('/edit/:id', function(req, res) {
		
		connection.query('SELECT * from photos WHERE id = ?', req.params.id, function(err, rows, fields) {
		if (err) throw err;
			res.render('admin/edit', { title: 'Editar Imagem',  data: rows});
		});

	});


	router.post('/create', multipartMiddleware, function(req, res){

		if (req.files.image.name != ""){

			fs.readFile(req.files.image.path, function (err, data) {

	   		  var imageName = uuid.v1() +'_'+ req.files.image.name;

			  var newPath = "./public/slides/"+imageName;
			  fs.writeFile(newPath, data, function (err) {
			  	if (err) throw err;

			     	var data = {
						title : req.body.title,
						description: req.body.description,
						path: imageName
					};
					
					connection.query("INSERT INTO photos set ? ",data, function(err, rows)
			        {
			          if (err)
			              console.log("Error inserting : %s ",err );
			         
			          res.redirect('/admin');
			          
			        });

			  });

			});

		}else{
				    var data = {
						title : req.body.title,
						description: req.body.description
					};
					
					connection.query("INSERT INTO photos set ? ",data, function(err, rows)
			        {
			          if (err)
			              console.log("Error inserting : %s ",err );
			         
			          res.redirect('/admin');
			          
			        });	
		}

	});

	router.put('/update', multipartMiddleware, function(req, res){
		if (req.files.image.name != ""){

				fs.readFile(req.files.image.path, function (err, data) {

		   		  var imageName = uuid.v1() +'_'+ req.files.image.name;

				  var newPath = "./public/slides/"+imageName;
				  fs.writeFile(newPath, data, function (err) {
				  	if (err) throw err;

				  		//Deleta imagem OLD
				  		fs.unlink('./public/slides/'+req.body.imageold, function (err) {
						  if (err) throw err;
						  console.log('successfully deleted!');
						});

				     	var data = {
							title : req.body.title,
							description: req.body.description,
							path: imageName
						};
						
						connection.query("Update photos set ? WHERE id = ? ",[data,req.body.id], function(err, rows)
				        {
				          if (err)
				              console.log("Error updating : %s ",err );
				         
				          res.redirect('/admin');
				          
				        });

				});

			});

		}else{
					data = {
						title : req.body.title,
						description: req.body.description
					};
					console.log(data);
					
					connection.query("Update photos set ? WHERE id = ? ",[data,req.body.id], function(err, rows)
			        {
			          if (err)
			              console.log("Error updating : %s ",err );
			         
			          res.redirect('/admin');
			          
			        });
		}
	});

	router.get('/destroy/:id', function(req, res){
        connection.query('SELECT * from photos WHERE id = ?', req.params.id, function(err, rows) {
							if (err) throw err;
							
				  			fs.unlink('./public/slides/'+rows[0].path, function (err) {
						  	if (err) throw err;
						  		console.log('successfully deleted!');
						  		connection.query("delete from photos WHERE id = ? ",req.params.id, function(err, rows)
								{
							  	    if (err){
							           console.log("Error deleting : %s ",err );
							           throw err;
							        }
									res.redirect('/admin');	          
								});
						  		
							});			
		});	
	});

	return router;
}