/**
 * Stores list of logged markets 
 */
 
var env = process.env.NODE_ENV || 'development'
 , root = '../../../'
 , config = require(root + 'config/config')[env]
 , EventEmitter = require('events').EventEmitter
 , util = require('util')
 , strutils = require(root + 'util/stringutil')
 , listutils = require(root + 'util/listutil')
 , logfac = require(root + 'app/models/services/prices/logfactory')
 , marketHistory = []
 
 

 /**
* PriceObserver Constructor 
*/
var PriceObserver = function PriceObserver () {
	
};
 
util.inherits(PriceObserver, EventEmitter);
 

/**
* Log price information with a winston logger 
*/
PriceObserver.prototype.synchronize = function(prices) {
	var logobj = generateLogObj(prices)
	var logger = logfac.getLogInstance(prices.marketId);
	logger.info('' , logobj);
	app.io.broadcast('tick_' + prices.marketId, prices);
} 

/**
* Remove winston logger from factory
*/
PriceObserver.prototype.passivate = function(market) {
	logfac.removeLogInstance(market.marketId);		
}

/**
* Parses price data and generates database entry
*/
function generateLogObj(prices) {
	var logobj = {}
	logobj['mid'] = prices.marketId; 
	for ( var playerIndex = 0; playerIndex < prices.runners.length; ++playerIndex) {
		var runner = prices.runners[playerIndex];
		for ( var cnt = 0; cnt < runner.backPrices.length; ++cnt) {
			var item = runner.backPrices[cnt];
			var index = '' + playerIndex + cnt;
			logobj['vb' + index] = item.amount;									
			logobj['pb' + index] = item.price;									
		}
		for ( var cnt = 0; cnt < runner.layPrices.length; ++cnt) {
			var item = runner.layPrices[cnt];
			var index = '' + playerIndex + cnt;
			logobj['vl' + index] = item.amount;									
			logobj['pl' + index] = item.price;	
		}
	}
	return logobj;
}


module.exports = PriceObserver;