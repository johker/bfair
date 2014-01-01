// Environment modules 

var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
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
	, orders = require(servicedir + 'orders/orderrequests')

var mid = "1.110937271";
var sid1 = "2662187";
var sid2 = "2445490";

var order1 = {"size":"2","price":"100","persistenceType":"LAPSE"}; 
var order2 = {"size":"2","price":"110","persistenceType":"LAPSE"}; 
var betInstructions = [{"selectionId":sid1,"handicap":"0","side":"BACK","orderType":"LIMIT","limitOrder":order1}, {"selectionId":sid2,"handicap":"0","side":"BACK","orderType":"LIMIT","limitOrder":order2}];
var params =  {"marketId":mid, "instructions": betInstructions}





instance.login(function(err, res){
 	sysLogger.info('<test_orders> Logged in to Betfair');
 	orders.placeOrders(params, function() {
 		sysLogger.info('<test_orders> <placeOrders>');
 		//console.log(res); 
		orders.listCurrentOrders({"marketIds":[mid], "placedDateRange":{}}, function(err, data) {
			sysLogger.info('<test_orders> <listCurrentOrders>');
			getCurrentOrders(mid, sid1, function(sidBets) {
				console.log(sidBets);
			}); 
			
			orders.cancelOrders({}, function() {
				sysLogger.debug('<test_orders> <cancelOrders>');
			});
			
		});
	});
 });	
 
function getCurrentOrders(mid, sid, cb) {
	orders.listCurrentOrders({"marketIds":[mid], "placedDateRange":{}}, function(err, data) {
		var currentBets = data.response.result.currentOrders;
		console.log(data);
		var sidBets = []; 
		for(var i = 0; i < currentBets.length; i++ ){
			if(currentBets[i].selectionId == sid) {
				sidBets.push(currentBets[i]);
			}
		}
		cb(sidBets);
	});
}


 
 
 