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

var mid = "1.110816445";
var sid = "41364"


var order = {"size":"2","price":"990","persistenceType":"LAPSE"}; 
var betInstructions = [{"selectionId":sid,"handicap":"0","side":"BACK","orderType":"LIMIT","limitOrder":order}];
var params =  {"marketId":mid, "instructions": betInstructions}


instance.login(function(err, res){
 	sysLogger.info('<test_orders> Logged in to Betfair'); 	
 	orders.placeOrders(params , function(err, res) {
 		sysLogger.info('<test_orders> <placeOrders>');
		orders.listCurrentOrders({}, function() {
			sysLogger.info('<test_orders> <listCurrentOrders>');
			sysLogger.info('<test_orders> ' + JSON.stringify(res.response.result.instructionReports)); 
		});
	});
 });	
 


 
 
 