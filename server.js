var util = require('util');
var fs = require("fs");
var path = require('path');
var storage = require('node-persist');
var express = require('express');

// Set up database
storage.initSync();

var app = express();

var concat = require('concat-stream');
app.use(function(req, res, next){
  req.pipe(concat(function(data){
    req.body = data;
    next();
  }));
});

function filterIdentifier(identifier) {
	return identifier.replace(/[^a-z0-9]/gi,'');
}

function isValidJSON(jsonString) {
	try {
	    JSON.parse(jsonString);
	    return true;
	} catch (e) {
	    return false;
	}
}

app.get('/content/:identifier', function (req, res) {
	var identifier = filterIdentifier(req.params.identifier);
	try {
			var data = storage.getItem(identifier);
			if (!data) {
				console.log("No such document: " + identifier);
				res.status(404).send("Document not found");
			} else {
				res.setHeader('Content-Type', 'application/json');
				res.status(200).send(data);
			}
		} catch (err) {
			res.status(500).send("An error occured");
			console.log("Error reading " + filename + ": " + err);
		}
});

app.post('/content/:identifier', function (req, res) {
	var identifier = filterIdentifier(req.params.identifier);
	var body = req.body;
	if (isValidJSON(body)) {
		storage.setItem(identifier, body);
		res.status(204).send("");
	} else {
		res.status(400).send("Bad JSON");
		console.log("Not valid JSON: " + body);
	}
});

var server = app.listen(10000, '0.0.0.0', function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('simple-json-api listening at http://%s:%s', host, port);

});
