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

var transferRequest = {
	inprogress:false,
	expected:'',  // can be amount ro toAccount
	to: '',
	amount: 0,
	valid: false
};

var account = {
	balance: 500
};


var getTransferDetails = function(input) {	
	
	transferRequest.inprogress = true;
	
	if(transferRequest.to=='') {
		var tokens = input.match(/ to (.*)/);
		if(tokens!=null) transferRequest.to = tokens[1].split(' ')[0];
		if(transferRequest.to=='transfer' || transferRequest.to=='be') transferRequest.to = '';		
	}
	
	if(transferRequest.expected=='toAccount') {
		transferRequest.to = input.replace('transfer to ','').split(' ')[0];
	}
	
	if(transferRequest.amount==0 || transferRequest.expected=='amount') {
		transferRequest.amount = Number(input.replace(/[^0-9\.-]+/g,""));
		transferRequest.valid = (transferRequest.amount!=0 && transferRequest.amount<=account.balance);			
	}
	
	if(transferRequest.to=='') {
		transferRequest.expected = 'toAccount';
		return "to whom do you want to transfer?";
	}
	
	if(transferRequest.amount==0) {
		transferRequest.expected = 'amount';
		return "how much do you want to transfer?";
	}
	
	if(!transferRequest.valid) {
		return "you have only "+account.balance+" to transfer, can you enter other amount less than "+account.balance+" to transfer?";
	}
	
	if(transferRequest.to!='' && transferRequest.valid) {
		
		
		var msg =  'transfer successful! ('+transferRequest.amount+' to '+transferRequest.to+'). Your reference number is 3432244';
		transferRequest = {
			inprogress:false,
			expected:'',  // can be amount ro toAccount
			to: '',
			amount: 0,
			valid: false
		};
		return msg;
	}
	
}

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
	
	var type;
	var reply = '';
	
	if(!transferRequest.inprogress) {
		type = classifier.classify(req.body.message);
	} else {
		type = 'fundTransfer';
	}
	
	if(type=='fundTransfer') {
		reply = getTransferDetails(req.body.message);
		console.log(transferRequest);
	}
	
	res.json({inputMessage:req.body.message, replyMessage:reply==''?replies[type]:reply});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});