var express = require('express');
var formidable = require('formidable');
var app = express();
var fs = require("fs");
var handlebars = require('express-handlebars').create({defaultLayout:"main"});
var credentials = require("./credentials");
var mysql = require("mysql");


app.use(express.static(__dirname +'/public'));
app.use(require('body-parser').urlencoded({extended:false}));

app.engine("handlebars",handlebars.engine);
app.set("view engine","handlebars");
app.set('port', process.env.PORT || 4000);

var con = mysql.createConnection(credentials.connection);

//homepage
app.get("/", function(req, res) {
	res.render("home");
});

//events page route
app.get("/events", function(req, res) {
        res.render("events");
});

//application page route
app.get("/bceapplication", function(req, res) {
        res.render("bceapplication");
});

app.get("/merch_shop", function(req, res) {
        res.render("merch_shop");
});

app.post("/apply_submit", function(req, res){
 var sql = "INSERT INTO applications (firstname, lastname, birth_date, height, school, phone, email) VALUES (?,?,?,?,?,?,?);"
 var values = [req.body.firstname,req.body.lastname,req.body.birth_date,req.body.height,req.body.school,req.body.phone, req.body.email];
							 con.query(sql, values, function(err, results) {
								 if (err) throw err;
								 res.redirect("/");
							 });
						 });

app.post("/get_events", (req, res) => {
	var sql="SELECT * FROM event_schedule";
	con.query(sql,(err, results) => {
		if (err){res.send({success: false});} else {res.send({success: results});}
	});
});


//_________________admin stuff________________________________


// admin page route
app.get("/admin_page", function(req, res) {
        res.render("admin_page");
});

app.post("/get_applications", (req, res) => {
	  var sql="SELECT * FROM applications";
        con.query(sql,(err, results) => {
         if (err){res.send({success: false});} else {res.send({success: results});}
   });
});

app.post("/update_events", function(req, res){
	var sql = "INSERT INTO event_schedule (event_name, event_location, event_date_time) VALUES (?,?,?);"
	var values = [req.body.event_name,req.body.event_location,req.body.event_date_time];
							 con.query(sql, values, function(err, results) {
								 if (err) throw err;
								 res.redirect("/admin_page");
							 });
						 });

app.listen(app.get('port'), function() {
        console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.' );
});
