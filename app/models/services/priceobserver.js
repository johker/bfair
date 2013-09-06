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
 , async = require('async')
 , lastLogged = {}     // used to check for changes 
 
 

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
PriceObserver.prototype.synchronize = function(books) {
	async.forEach(books, log, function(err) {
		if (err) return next(err);
       	sysLogger.debug('<PriceObserver.prototype.synchronize> Synchronized book of length = ' + books.length );
	});
} 

/**
* Log price information with a winston logger.
*/
function log(book, callback) {
	var logobj = generateLogObj(book);
	logfac.getLogInstance(book.marketId, function(logger) {
		if(logger == null) callback(new Error('Could not initialize logger')); 
		var s1 = JSON.stringify(lastLogged[book.marketId]);	
		s1 = s1 != undefined ? s1.substring(s1.indexOf("message"), s1.length) : 'undefined';
		var s2 = JSON.stringify(logobj);
		s2 = s2 != undefined ? s2.substring(s2.indexOf("message"), s2.length) : 'undefined';
		if(s1 != s2) { 
			sysLogger.notice('Price update for id = ' + book.marketId); 
			lastLogged[book.marketId] = logobj; 
			logger.info('' , logobj);
		} 
		var mid = book.marketId.substring(2,book.marketId.length);	
		app.io.broadcast('tick_' + mid, book);
		callback();
	});
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
	var logobj = {};	
	logobj['timestamp'] = (new Date()).getTime();
	logobj['message'] = ''; 
	for ( var pIdx = 0; pIdx < book.runners.length; pIdx++) {
		var avaliableToBack = book.runners[pIdx].ex.availableToBack;		
		for(var bIdx = 0; bIdx < avaliableToBack.length; bIdx++) {
			var index = '' + pIdx + bIdx;
			logobj['vb' + index] = avaliableToBack[bIdx].size;								
			logobj['pb' + index] = avaliableToBack[bIdx].price;		
		}
		var availableToLay = book.runners[pIdx].ex.availableToLay;
		for(var bIdx = 0; bIdx < availableToLay.length; bIdx++) {
			var index = '' + pIdx + bIdx;
			logobj['vl' + index] = availableToLay[bIdx].size;									
			logobj['pl' + index] = availableToLay[bIdx].price;		
		}
	}
	//console.log(logobj); 
	return logobj;
}


module.exports = PriceObserver;