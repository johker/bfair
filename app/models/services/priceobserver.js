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
* Log price information with a winston logger: Expecting array with 
* price information for multiple markets. 
*/
PriceObserver.prototype.synchronize = function(book) {
	// sysLogger.info('<PriceObserver.prototype.synchronize> book length = ' + book.length ); 
	for(var bidx = 0; bidx < book.length; bidx++) {
		var logobj = generateLogObj(book[bidx]);
		var logger = logfac.getLogInstance(book[bidx].marketId);
		logger.info('' , logobj);
		var mid = book[bidx].marketId.substring(2,book[bidx].marketId.length);	
		app.io.broadcast('tick_' + mid, book[bidx]);
	} 
	
} 

/**
* Remove winston logger from factory
*/
PriceObserver.prototype.passivate = function(marketId) {
	logfac.removeLogInstance(marketId);		
}

/**
* Parses price data and generates database entry
*/
function generateLogObj(book) {
	var logobj = {}
	logobj['mid'] = book.marketId; 
	for ( var pIdx = 0; pIdx < book.runners.length; pIdx++) {
		var avaliableToBack = book.runners[pIdx].ex.availableToBack;
		for(var bIdx = 0; bIdx < avaliableToBack; bIdx++) {
			var index = '' + pIdx + bIdx;
			logobj['vb' + index] = avaliableToBack[bIdx].size;								
			logobj['pb' + index] = avaliableToBack[bIdx].price;		
		}
		var availableToLay = book.runners[pIdx].ex.availableToLay;
		for(var bIdx = 0; bIdx < availableToLay; bIdx++) {
			var index = '' + pIdx + bIdx;
			logobj['vl' + index] = availableToLay[bIdx].size;									
			logobj['pl' + index] = availableToLay[bIdx].price;		
		}
	}
	return logobj;
}


module.exports = PriceObserver;