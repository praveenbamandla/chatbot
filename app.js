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
	valid: false,
	confirmed:false
};

var loanRequest = {
	inprogress:false,
	type:'',  // can be car or home	
};

var account = {
	balance: 500,
	canSendTo: {
		'praveen': 'NLV314455',
		'prasad':  'NLG424523',
		'pratap':  'NLG424523'
	}
};

var getLoanDetails = function(input) {	
	
	loanRequest.inprogress = true;
	
	if(input.toLowerCase().indexOf('cancel')>=0) {	
		
		var msg =  'Ok, do you want anything else?';
		loanRequest = {
			inprogress:false,
			type:'' // can be car or home
		};
		return msg;
	}
	
	if( input.toLowerCase().indexOf('car')>=0 ) loanRequest.type = 'car';
	if( input.toLowerCase().indexOf('home')>=0 || input.indexOf('house')>=0 ) loanRequest.type = 'home';
	
	
	if(loanRequest.type=='car') {
		loanRequest = {
			inprogress:false,
			type:'' // can be car or home
		};
		return "Car loans has 8.5% interest, you can opt it for 1-5 years tenure.";	
		
	}
	
	if(loanRequest.type=='home') {
		loanRequest = {
			inprogress:false,
			type:'' // can be car or home
		};
		return "Home loans has 8% interest, you can opt it for 5-25 years tenure. ";	
	}
	
	if(input.toLowerCase().indexOf('cancel')>=0) {	
		
		var msg =  'Ok, do you want anything else?';
		loanRequest = {
			inprogress:false,
			type:'' // can be car or home
		};
		return msg;
	}
	
	return "Which loan details do you need, for car or home?";
	
	
}




var getTransferDetails = function(input) {	
	
	transferRequest.inprogress = true;
	
	if(input.toLowerCase().indexOf('cancel')>=0 || (transferRequest.expected=='confirmation' && input.toLowerCase().indexOf('no')>=0)  ) {
		
		
		var msg =  'transfer cancelled.';
		transferRequest = {
			inprogress:false,
			expected:'',  // can be amount ro toAccount
			to: '',
			amount: 0,
			valid: false,
			confirmed:false
		};
		return msg;
	}
	
	
	if(transferRequest.to=='') {
		var tokens = input.match(/ to (.*)/);
		if(tokens!=null) {
			if(tokens[1].indexOf(' to ')>=0) {
				//console.log('gggggg');
				tokens = tokens[1].match(/ to (.*)/);
				if(tokens!=null) transferRequest.to = tokens[1].split(' ')[0];
			} else {
				transferRequest.to = tokens[1].split(' ')[0];
			}
		}
		
		
		//console.log('here22',transferRequest.to);
		
		//console.log();
		if(transferRequest.to=='transfer' || transferRequest.to=='be' || transferRequest.to=='send') transferRequest.to = '';		
		
	}
	
	if(transferRequest.expected=='toAccount') {
		transferRequest.to = input.replace('transfer to ','').replace('to ','').replace('send to ','').split(' ')[0];		
	}
	
	if(transferRequest.amount==0 || ( transferRequest.expected=='' ||  transferRequest.expected=='amount' ) ) {
		transferRequest.amount = Number(input.replace(/[^0-9\.-]+/g,""));
		transferRequest.valid = (transferRequest.amount!=0 && transferRequest.amount<=account.balance);			
	}
	
	if(transferRequest.to=='') {
		//console.log(transferRequest.to);
		transferRequest.expected = 'toAccount';
		return "To whom do you want to transfer?";
	} else {
		if(!account.canSendTo[transferRequest.to.toLowerCase()]) {
			transferRequest.expected = 'toAccount';
			var msg = 'You can only send money to one of your benficiary list, here is your benficiary list <br /><br /><ul class="list-unstyled">';
			 
			for(var i in account.canSendTo) 
				msg += '<li>'+capitalizeFirstLetter(i)+' ('+account.canSendTo[i]+')</li>';		
			msg += '</ul>To whom do you want to transfer?';
			return msg;
		}
		
	}
	
	if(transferRequest.amount==0) {
		transferRequest.expected = 'amount';
		return "how much do you want to transfer?";
	}
	
	if(!transferRequest.valid) {
		transferRequest.expected = 'amount';
		return "you have only "+account.balance+" to transfer, can you enter other amount less than "+account.balance+" to transfer?";
	}
	
	
	if(transferRequest.expected=='confirmation') {
		if(input.toLowerCase().indexOf('yes')>=0) transferRequest.confirmed = true;
		
	}
	
	if(input.toLowerCase().indexOf('cancel')>=0 || (transferRequest.to!='' && transferRequest.valid)) {
		
		if(transferRequest.confirmed) {
		
			account.balance-=transferRequest.amount;
			var msg =  '<span class="success">Transfer successful! ('+transferRequest.amount+' to '+transferRequest.to+'). Your reference number is 3432244. Remaining balance is '+account.balance+'</span>';
			
			console.log('POST /transfer-to?username='+transferRequest.to+'&amount='+transferRequest.amount);
			
			transferRequest = {
				inprogress:false,
				expected:'',  // can be amount ro toAccount
				to: '',
				amount: 0,
				valid: false,
				confirmed:false
			};
			return msg;
		
		} else {
			transferRequest.expected = 'confirmation';
			return "Are you sure you want to transfer "+transferRequest.amount+" to "+transferRequest.to+"? [yes/no]";			
		}
		
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

app.get('/assets/html2canvas.min.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/html2canvas.min.js'));
});

app.get('/assets/images/user.png', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/images/user.png'));
});

app.get('/assets/images/assistant.png', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/images/assistant.png'));
});

app.get('/assets/images/ABN-AMRO.png', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/images/ABN-AMRO.png'));
});

app.get('/assets/images/ABN-AMRO-logo.png', function (req, res) {
  res.sendFile(path.join(__dirname + '/assets/images/ABN-AMRO-logo.png'));
});

app.post('/submit-message', function(req, res){
	
	var type;
	var reply = '';
	
	type = classifier.classify(req.body.message);
	console.log(type);
	
	if(transferRequest.inprogress) {
		type = type=='loan'? type : 'fundTransfer';		
	}
	
	if(loanRequest.inprogress) {
		type = type=='fundTransfer'?type:'loan';
	}
	
	if(type=='fundTransfer') {
		reply = getTransferDetails(req.body.message);
		//console.log(transferRequest);
	}
	
	if(type=='loan') {
		reply = getLoanDetails(req.body.message);
		//console.log(loanRequest);
	}
	
	if(type=='balance') {
		console.log('GET /balance');
		reply = 'your account balance as of now is '+account.balance;
	}
	
	
	console.log(transferRequest);
	res.json({inputMessage:req.body.message, replyMessage:reply==''?replies[type]:reply});
});

app.post('/clear-message', function(req, res){
	transferRequest = {
		inprogress:false,
		expected:'',  // can be amount ro toAccount
		to: '',
		amount: 0,
		valid: false
	};
});

app.listen(3000, function () {
  console.log('Chatbot app listening on port 3000!')
  //console.log(loanRequest,transferRequest);
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}