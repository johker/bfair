/**
 * New node file
 */
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
var orders = require(executiondir + 'execution/orders')
	, request = require(servicedir + 'prices/pricerequests')
	, session =  require(servicedir + 'session').Singelton.getInstance().getSession();

var mid = "1.110850760";
var sid = "3633030"



session.enableBetEmulatorForMarket(mid);

var order = {"size":"2","price":"990","persistenceType":"LAPSE"}; 
var betInstructions = [{"selectionId":sid,"handicap":"0","side":"BACK","orderType":"LIMIT","limitOrder":order}];
var params =  {"marketId":mid, "instructions": betInstructions}
var filter = { marketIds: [ mid], priceProjection: { priceData: [ 'EX_ALL_OFFERS' ] } };

// log all Betfair invocations
// session.startInvocationLog({level: 'info', path: 'log_invocations.txt'});
// session.startEmulatorLog({level: 'info', path: 'log_emulator.txt'});


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
	sysLogger.crit('<test_emulator> <login>');
	request.listMarketBook(filter, function(err, res) {
		sysLogger.crit('<test_emulator> <listMarketBook>'); 
		orders.placeOrders(params, function(err, res) {
			sysLogger.crit('<test_emulator> <placeOrders>');
			sysLogger.crit(JSON.stringify(res,null,2));
		});
	});	
});


/*

 */

 
 
 