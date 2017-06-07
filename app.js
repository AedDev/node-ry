var mysql = require('mysql');
var express = require('express');
var bparser = require('body-parser')
var app = express();

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
			return;
		}

		res.render('index', { title: 'Addressbook', heading: 'Addressbook', addresses: results });
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

app.listen(8080, function(err) {
	console.log('Server startet on ' + 8080);
});
