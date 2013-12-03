/**
 * New node file
 */


var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
	, config = require(root + 'config/config')[env]
	, async = require('async')
	, winston = require(root + 'config/winston');

// GLOBAL variables
sysLogger = winston.getSysLogger()
betfair = require(root + 'app/models/api'); // Patched version 
// betfair = require('betfair'); // node module

// Test modules
var orders = require(servicedir + 'orders/orderrequests')
	, request = require(servicedir + 'prices/pricerequests')
	, session =  require(servicedir + 'session').Singelton.getInstance().getSession();

var mid = "1.110939130";
var sid = "2445490"
 	

session.enableBetEmulatorForMarket(mid);

var backorder1 = {"size":"20","price":"120","persistenceType":"LAPSE"}; 
var layorder1 = {"size":"20","price":"110","persistenceType":"LAPSE"}; 
var betInstructions = [{"selectionId":sid,"handicap":"0","side":"BACK","orderType":"LIMIT","limitOrder":backorder1}, 
						{"selectionId":sid,"handicap":"0","side":"LAY","orderType":"LIMIT","limitOrder":layorder1}
					];
var params =  {"marketId":mid, "instructions": betInstructions};
var cancelparams = {"marketId":mid};
var filter = { marketIds: [ mid], priceProjection: { priceData: [ 'EX_ALL_OFFERS' ] } };

// log all Betfair invocations
session.startInvocationLog({level: 'info', path: 'log_invocations.txt'});
session.startEmulatorLog({level: 'info', path: 'log_emulator.txt'});


// Optional step to test emulator
function enableEmulator(data, cb) {
    if (!cb) {	
        cb = data;
    } 
    var mId = data.selectedMarket.marketId;
    sysLogger.notice('<test_emulator_listmarketbook> <enableEmulator> Enable emulator for marketId = ' + mId );
    session.enableBetEmulatorForMarket(mId);
    cb(null, data);
}


session.login(config.betfair.user, config.betfair.password, function(err, res) {
	sysLogger.debug('<test_emulator> <login>');
	request.listMarketBook(filter, function(err, res) {
		sysLogger.debug('<test_emulator> <listMarketBook> ' + JSON.stringify(res.response,null,2));
		orders.placeOrders(params, function(err, res) {
			sysLogger.debug('<test_emulator> <placeOrders> res = ' + JSON.stringify(res,null,2));
			request.listMarketBook(filter, function(err, res) {
				sysLogger.crit('<test_emulator> <listMarketBook> ' + JSON.stringify(res.response,null,2));	
				});
			/*
			orders.cancelOrders(cancelparams, function(err, res) {
				sysLogger.crit('<test_emulator> <cancelOrders> res = ' + JSON.stringify(res,null,2));
			});
			*/
		});
	});	
});



 
 
 