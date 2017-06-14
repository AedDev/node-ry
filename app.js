var mysql = require('mysql');
var express = require('express');
var bparser = require('body-parser')
var app = express();

//something something darkside

var pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'ry',
	password: '12345678',
	database: 'addressbook'
});

app.set('view engine', 'pug');
app.use(bparser.json());
app.use(bparser.urlencoded({
	extended: true
}));

app.get('/', function(req, res){
	pool.query('SELECT * FROM entries', function(err, results, fields){
		if (err) {
			console.log(err);
		}

		res.render('index', { title: 'Addressbook', heading: 'Addressbook', addresses: results });
	});
});

app.get('/delete', function(req, res){
	var id = req.query.id;

	pool.query('DELETE FROM entries WHERE id = ' + id, function(err){
		if (err) {
			// TODO Error page
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

app.get('/add', function(req, res){
	res.render('add');
});

app.post('/add', function(req, res){
	pool.query({
		sql: 'INSERT INTO entries(name, lastname, street, number) VALUES(?, ?, ?, ?)',
		values: [ req.body.name, req.body.lastname, req.body.street, req.body.number ]
	}, function(err, results, fields){
		res.render('add', { result: (err ? false : true), error: err });
	});
});

app.get('/edit', function(req, res){
	var id = req.query.id;

	pool.query('SELECT * FROM entries WHERE id = ' + id, function(err, results, fields){
		res.render('edit', { item: results[0] });
	});
});

app.post('/edit', function(req, res){
	var aItem = {
		id: req.body.id,
		name: req.body.name,
		lastname: req.body.lastname,
		street: req.body.street,
		number: req.body.number
	};

	pool.query({
		sql: 'UPDATE entries SET name = ?, lastname = ?, street = ?, number = ? WHERE id = ?',
		values: [ req.body.name, req.body.lastname, req.body.street, req.body.number, req.body.id ]
	}, function(err, results, fields){
		res.render('edit', { result: (err ? false : true), error: err, item: aItem });
	});
});

app.listen(8080, function(err) {
	console.log('Server startet on ' + 8080);
});
