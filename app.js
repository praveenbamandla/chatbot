var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var BrainJSClassifier = require('natural-brain');

// Classiy
var app = express();
var classifier = new BrainJSClassifier();

var classifierPage = require('./classifier.js');
var classifierObj = new classifierPage();

var type = '';

var replies = classifierObj.getIntentCategories();

classifierObj.classifyIntents(classifier);

// Server
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/assets/bootstrap.min.css', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/bootstrap.min.css'));
});

app.get('/assets/jquery.min.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/jquery.min.js'));
});

app.get('/assets/jspdf.min.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/jspdf.min.js'));
});

app.get('/assets/images/user.png', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/images/user.png'));
});

app.get('/assets/images/assistant.png', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/images/assistant.png'));
});

app.post('/submit-message', function(req, res){
	type = classifier.classify(req.body.message);
	res.json({inputMessage:req.body.message, replyMessage:replies[type]});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});