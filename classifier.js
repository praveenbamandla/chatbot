module.exports = function(){

    this.intents = {
        'fundTransfer': [
            'fund transfer',
            'I want to transfer funds',
            'P2P fund transfer',
            'want to transfer money',
			'send money',
			'pay to'
        ],
        'greeting': [
            'Hi',
            'How are you ?',
            'Hello',
            'Hey'
        ],
        'loan': [
            'loan',
            'loan interest rates',
            'mortgage',
			'loan eligibility',
            'loan tenure',
            'loan eligibility criteria'
		],
		'balance':[
			'what is balance',
			'balance amout',
			'current balance',
			'account balance',
			'account statement'
		]
    };

    // Classifier
    this.getIntentCategories = function(){
        return {
            'greeting':'Hello, How can I assist you?',
            'loan': 'Sure, I can help you with loan information, Which loan details do you need, for car or home?',
           // 'interest': 'car 10%, home 8%',
           // 'payment': 'can be opted with 6, 12 or 24 months',
            'fundTransfer': 'Sure, I can help you transfer money.'
        };
    };

    this.classifyIntents = function(classifier){
        /*classifier.addDocument(this.intents['greeting'].join(' '), 'greeting');
        classifier.addDocument(this.intents['loan'].join(' '), 'loan');
        classifier.addDocument(this.intents['interest'].join(' '), 'interest');
        classifier.addDocument(this.intents['payment'].join(' '), 'payment');
        classifier.addDocument(this.intents['fundTransfer'].join(' '), 'fundTransfer');*/

        for(var intent in this.intents){
            //if(this.intents.hasOwnProperty(intent)){
                for(var j in this.intents[intent]) {
					console.log(this.intents[intent][j], intent);
					classifier.addDocument(this.intents[intent][j], intent);
				}
				
            //}
        }

        classifier.train();
    };

}