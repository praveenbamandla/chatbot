var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var BrainJSClassifier = require('natural-brain');
//var player = require('play-sound')( opts = {player: "D:\\mpg123\\out.exe"});

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
	type = classifier.classify(req.body.message);console.log(type);
	if(type){
		res.json({inputMessage:req.body.message, replyMessage:replies[type]});
		/*player.play('pop.mp3', function(err){console.log(err);
		  if (err) throw err
		});*/
	} else {
		res.json({inputMessage:req.body.message, replyMessage:'I did not get you. Can you please clarify.'});
	}
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});