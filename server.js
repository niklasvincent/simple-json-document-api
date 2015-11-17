var util = require('util');
var fs = require("fs");
var path = require('path');
var express = require('express');

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

function buildFileName(identifier) {
	return path.join(__dirname, "data", identifier + ".json");
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
	var filename = buildFileName(identifier);
	if (fs.existsSync(filename)) { 
		try {
				var data = require(filename);
				res.setHeader('Content-Type', 'application/json');
				res.status(200).send(data);
			} catch (err) {
				res.status(500).send("An error occured");
				console.log("Error reading " + filename + ": " + err);
			}
	} else {
		console.log("No such document: " + filename);
		res.status(404).send("Document not found");
	}
});

app.post('/content/:identifier', function (req, res) {
	var identifier = filterIdentifier(req.params.identifier);
	var filename = buildFileName(identifier);
	var body = req.body;
	if (isValidJSON(body)) {
		fs.writeFile(filename, body, "utf8");
		console.log("Wrote data to " + filename);
		res.status(204).send("");
	} else {
		res.status(400).send("Bad JSON");
		console.log("Not valid JSON: " + body);
	}
});

var server = app.listen(10000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('simple-json-api listening at http://%s:%s', host, port);

});
