// Environment modules 

var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
	, executiondir = root + 'app/models/'
	, config = require(root + 'config/config')[env]
	, async = require('async')
	, winston = require(root + 'config/winston');

// GLOBAL variables
sysLogger = winston.getSysLogger()

// GLOBAL variables
sysLogger = winston.getSysLogger()
betfair = require(root + 'app/models/api'); // Patched version 

// Test modules
var session = require(servicedir + 'session')
	, instance = session.Singelton.getInstance()
	, orders = require(executiondir + 'execution/orders')

var mid = "1.107453576";
var sid = "1178876"


var order1 = {"size":"2","price":"990","persistenceType":"LAPSE"}; 
var order2 = {"size":"2","price":"980","persistenceType":"LAPSE"}; 
var betInstructions = [{"selectionId":sid,"handicap":"0","side":"BACK","orderType":"LIMIT","limitOrder":order1}, {"selectionId":sid,"handicap":"0","side":"BACK","orderType":"LIMIT","limitOrder":order2}];
var params =  {"marketId":mid, "instructions": betInstructions}


instance.login(function(err, res){
 	sysLogger.info('<test_orders> Logged in to Betfair'); 	
 	orders.placeOrders(params , function(err, res) {
 		sysLogger.info('<test_orders> <placeOrders>');
 		console.log(res); 
		orders.listCurrentOrders({}, function() {
			sysLogger.info('<test_orders> <listCurrentOrders>');
		
		});
	});
 });	
 


 
 
 