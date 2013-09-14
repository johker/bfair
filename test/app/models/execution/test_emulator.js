/**
 * New node file
 */


var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
	, executiondir = root + 'app/models/'
	, config = require(root + 'config/config')[env]
	, async = require('async')
	, winston = require(root + 'config/winston');

// GLOBAL variables
sysLogger = winston.getSysLogger()
betfair = require(root + 'app/models/api'); // Patched version 
// betfair = require('betfair'); // node module

// Test modules
var orders = require(executiondir + 'execution/orders')
	, request = require(servicedir + 'prices/pricerequests')
	, session =  require(servicedir + 'session').Singelton.getInstance().getSession();

var mid = "1.107453576";
var sid = "1178876"


session.enableBetEmulatorForMarket(mid);

var order1 = {"size":"2","price":"990","persistenceType":"LAPSE"}; 
var order2 = {"size":"2","price":"980","persistenceType":"LAPSE"}; 
var betInstructions = [{"selectionId":sid,"handicap":"0","side":"BACK","orderType":"LIMIT_ORDER","limitOrder":order1}, {"selectionId":sid,"handicap":"0","side":"BACK","orderType":"LIMIT_ORDER","limitOrder":order2}];
var params =  {"marketId":mid, "instructions": betInstructions}
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
			console.log(res);
			sysLogger.crit('<test_emulator> <placeOrders> ' + JSON.stringify(res.response,null,2));
			process.exit(1);
		});
	});	
});


/*

 */

 
 
 