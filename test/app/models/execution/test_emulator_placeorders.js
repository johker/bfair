
// Environment modules 

var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
	, executiondir = root + 'app/models/'
	, config = require(root + 'config/config')[env]
	, betfair = require('betfair')
	, async = require('async')
	, winston = require(root + 'config/winston')
	, debug = require(root + 'util/debug')

// GLOBAL variables
sysLogger = winston.getSysLogger()


var mid = "1.110834761";
var sid = "2996931"


// Test modules
var common = require(servicedir + 'session').Singelton.getInstance()
	, request = require(servicedir + 'markets/marketrequests')
	, par = {}

// log all Betfair invocations
var session = common.getSession();
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


function listMarketBook(data, cb) {
    if (!cb)
        cb = data;

    //var price = ['EX_ALL_OFFERS'];
    var req = {
        marketIds: [data.selectedMarket.marketId],
        matchProjection: 'NO_ROLLUP',
        priceProjection: {priceData: ['EX_ALL_OFFERS', 'EX_TRADED']}
    };
    session.listMarketBook(req, function (err, res) {
        debug.serviceCall({position: '<test_emulator_listmarketbook> <listMarketBook>', err : err, res: res});
        sysLogger.debug('<test_emulator_listmarketbook> <listMarketBook> Request:%s\n', JSON.stringify(res.request, null, 2))
        sysLogger.debug('<test_emulator_listmarketbook> <listMarketBook> Response:%s\n', JSON.stringify(res.response, null, 2));
        cb(err, data);
    });
}

// list market catalogue
function listMarketCatalogue(cb) {
    // Tennis, MATCH ODDS
    sysLogger.info('<test_emulator_listmarketbook> Calling listMarketCatalogue...');
    var filter = { eventTypeIds: [2], marketTypeCodes: ['MATCH_ODDS']};
    var what = ['EVENT', 'EVENT_TYPE', 'COMPETITION', 'MARKET_START_TIME', 'RUNNER_DESCRIPTION'];
    session.listMarketCatalogue({filter: filter, marketProjection: what, maxResults: 1000}, function (err, res) {
        debug.serviceCall({position: '<test_emulator_listmarketbook> <listMarketCatalogue>', err : err, res: res});
        sysLogger.debug('<test_emulator_listmarketbook> There are' + res.response.result.length + ' markets');
        par.markets = res.response.result;
        cb(err, par);
    });
}

// select the most far market from the markets array
function selectMarket(cb) {
    sysLogger.info('<test_emulator_listmarketbook> <selectMarket>');
    if (par.markets.length < 1) {
        throw new Error('No markets to test');
    }
    par.selectedMarket = par.markets[par.markets.length - 1];
    sysLogger.debug('<test_emulator_listmarketbook> <selectMarket> Selected Market marketId= ' + par.selectedMarket.marketId + ', name= ' + par.selectedMarket.event.name);
    cb(null, par);
}

function placeOrders(data, cb) {
    if (!cb) {
        cb = data;
    }
    sysLogger.debug('<test_emulator_listmarketbook> <placeOrders> Invoke placeOrders...');
    var market = data.selectedMarket;
    var bets = [
        {
            orderType: 'LIMIT',
            selectionId: market.runners[0].selectionId,
            side: 'LAY',
            limitOrder: {
                price: 1.01,
                size: 5.00,
                persistenceType: 'LAPSE'
            }
        },
        {
            orderType: 'LIMIT',
            selectionId: market.runners[0].selectionId,
            side: 'BACK',
            limitOrder: {
                price: 1000,
                size: 5.00,
                persistenceType: 'LAPSE'
            }
        }
    ];
    var ref = (new Date()).toISOString();
    session.placeOrders({marketId: market.marketId, instructions: bets, customerRef: ref}, function (err, res) {
        debug.serviceCall({position: '<test_emulator_listmarketbook> <placeOrders>', err : err, res: res});
        sysLogger.debug('<test_emulator_listmarketbook> <placeOrders> Request:%s\n', JSON.stringify(res.request, null, 2))
        sysLogger.debug('<test_emulator_listmarketbook> <placeOrders> Response:%s\n', JSON.stringify(res.response, null, 2));
        var result = res.response.result;
        sysLogger.info('<test_emulator_listmarketbook> <placeOrders> result = ' +  JSON.stringify(result, null, 2));
        data.betIds = result.instructionReports.map(function (i) {
            return i.betId;
        });
        cb(err, data);
    });
}


common.login(function(err, res){
 	sysLogger.info('<test_emulator_listmarketbook> Logged in to Betfair'); 
 		listMarketCatalogue(function(err,par){
 			sysLogger.debug('<test_emulator_listmarketbook> <listMarketCatalogue> par = ' + JSON.stringify(par, null, "\t") );
 			selectMarket(function(err, data) {
 				sysLogger.debug('<test_emulator_listmarketbook> <selectMarket> res = ' + JSON.stringify(data.selectedMarket, null, 2));
 				enableEmulator(data, function(err, datae) {
 					sysLogger.debug('<test_emulator_listmarketbook> <enalbleEmulator> ' + JSON.stringify(data, null, 2));
 					listMarketBook(datae, function(err, datal) {
 						sysLogger.debug('<test_emulator_listmarketbook> <listMarketBook> ' + JSON.stringify(datal, null, 2));
 					 }); 				
 				});
 			});
 			 
 		});
 	});




