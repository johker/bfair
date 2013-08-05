// Environment modules 

var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
	, executiondir = root + 'app/models/'
	, config = require(root + 'config/config')[env]
	, betfair = require('betfair')
	, async = require('async')
	, winston = require(root + 'config/winston');

// GLOBAL variables
sysLogger = winston.getSysLogger()


// Test modules
var session = require(servicedir + 'session')
	, instance = session.Singelton.getInstance()
	, orders = require(executiondir + 'execution/orders')


var order = {"size":"2","price":"990","persistenceType":"LAPSE"}; 
var betInstructions = [{"selectionId":"2248507","handicap":"0","side":"BACK","orderType":"LIMIT","limitOrder":order}];

var params =  {"marketId":"1.110368965", "instructions": betInstructions}

instance.login(function(err, res){
 	sysLogger.info('<test_orders> Logged in to Betfair'); 	
 	orders.placeOrders(params , function(err, res) {
 		sysLogger.info('<test_orders> <placeOrders>');
		console.log(res); 
		orders.listCurrentOrders({}, function() {
			sysLogger.info('<test_orders> <listCurrentOrders>');
			console.log(res); 
		});
	});
 });	
 

 
 
 