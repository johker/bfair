var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
	, config = require(root + 'config/config')[env]
	, betfair = require('betfair')
	, async = require('async')
	, winston = require(root + 'config/winston');

// GLOBAL variables
sysLogger = winston.getSysLogger();
	
	
// Test modules
var session = require(servicedir + 'session')
	, instance = session.Singelton.getInstance()
	, projection = require(servicedir + 'prices/projection')
	, request = require(root + 'app/models/account/funds');


instance.login(function(err, res){
 	sysLogger.notice('<test_funds> Logged in to Betfair');
 	request.getAccountFunds({}, function(err, res) {
		sysLogger.notice('<test_funds> callback');
	});
 });	