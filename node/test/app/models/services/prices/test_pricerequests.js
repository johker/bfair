// Environment modules 

var env = process.env.NODE_ENV || 'development'
	, root = '../../../../../'
	, servicedir = root + 'app/models/services/'
	, config = require(root + 'config/config')[env]
	, async = require('async')
	, winston = require(root + 'config/winston');

// GLOBAL variables
sysLogger = winston.getSysLogger()
betfair = require(root + 'app/models/api'); // Patched version 
// betfair = require('betfair'); // node module
	
// Test modules
var session = require(servicedir + 'session')
	, instance = session.Singelton.getInstance()
	, projection = require(servicedir + 'prices/projection')
	, request = require(servicedir + 'prices/pricerequests')


var filter = { marketIds: 
   [ '1.110937271'],
  priceProjection: { priceData: [ 'EX_ALL_OFFERS' ] } };

	
instance.login(function(err, res){
 	sysLogger.info('<test_marketrequests> Logged in to Betfair');
 	request.listMarketBook(filter, function(err, res) {
 		//console.log(res.response.result[0].runners[0]); 
 		var book = res.response.result[0].runners[0];
 		var th = 1.00;
		var avToBack = book.ex.availableToBack;
		var avToLay = book.ex.availableToLay;
		ordersToCall = [];
		if(avToBack != null) {
			for(var i = avToBack.length-1; i >= 0 ; i--) {
				if(th < avToBack[i].price) {
				 	ordersToCall.push({'type': 'LAY', 'price': avToBack[i].price, 'size': avToBack[i].size});
				 }
			}
		}
		if(avToLay != null) {
			for(var i = avToLay.length-1; i >= 0 ; i--) {
				if(th > avToLay[i].price) {
				 	ordersToCall.push({'type': 'BACK', 'price': avToLay[i].price, 'size': avToLay[i].size});
				 }
			}
		}
		console.log(ordersToCall);
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
