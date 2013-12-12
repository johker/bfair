/**
 * Stores list of logged markets 
 */
 
var env = process.env.NODE_ENV || 'development'
 , root = '../../../../'
 , servicedir = root + 'app/models/services/'
 , config = require(root + 'config/config')[env]
 , EventEmitter = require('events').EventEmitter
 , util = require('util')
 , strutils = require(root + 'util/stringutil')
 , listutils = require(root + 'util/listutil')
 , logfac = require(root + 'app/models/services/prices/logfactory')
 , marketHistory = []
 , async = require('async')
 , lastLogged = {}     // used to check for changes 
 , executiondir = root + 'app/models/execution/'
 , bookutil = require(servicedir + 'book');
 

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
	async.forEach(books, investigate, function(err) {	
		if (err) return next(err);		
       	sysLogger.debug('<PriceObserver.prototype.synchronize> Synchronized book of length = ' + books.length );
    });
} 


function investigate(book, callback) {
	log(book, callback);
} 


/**
* Log price information with a winston logger.
*/
function log(book, callback) {
	var logobj = bookutil.getPriceInformation(book);
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
		if(book.marketId == config.api.testMarketId) {
			sysLogger.debug('<priceobserver> <log> tick_' + book.marketId);	
		}
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



module.exports = PriceObserver;