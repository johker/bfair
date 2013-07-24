// Environment modules 

var env = process.env.NODE_ENV || 'development'
	, root = '../../../../../'
	, servicedir = root + 'app/models/services/'
	, config = require(root + 'config/config')[env]
	, betfair = require('betfair')
	, async = require('async')
	, winston = require(root + 'config/winston');

// GLOBAL variables
sysLogger = winston.getSysLogger()
	
	
// Test modules
var session = require(servicedir + 'session')
	, instance = session.Singelton.getInstance()
	, projection = require(servicedir + 'prices/projection')
	, request = require(servicedir + 'prices/pricerequests')


var filter = { marketIds: 
   [ '1.110165036', '1.110165037'],
  priceProjection: { priceData: [ 'EX_ALL_OFFERS' ] } };

	
instance.login(function(err, res){
 	sysLogger.info('<test_marketrequests> Logged in to Betfair');
 	request.listMarketBook(filter, function(err, res) {
 		console.log(res.response.result[0].runners[0].ex); 
		//console.log(res.response.result[0].runners[0].ex.availableToBack ); 
	});
 });	


/*
function filter(par, cb) {
	cb(null, { "filter": {"eventTypeIds" : [2], "turnsInPlay" : true}});
}

async.waterfall([instance.login, filter, request.listMarkets, instance.logout], function(err,res) {
    sysLogger.info('<marketqequests_test> <async.waterfall> res.response = ' + res.response);
    process.exit(0);	
});
*/
