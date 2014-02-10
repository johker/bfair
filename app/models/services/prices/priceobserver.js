/**
 * Stores list of logged markets 
 */
 
var root = '../../../../'
 , servicedir = root + 'app/models/services/'
 , rtc = require(root + 'app/controllers/configcontroller')
 , EventEmitter = require('events').EventEmitter
 , util = require('util')
 , strutils = require(root + 'util/stringutil')
 , listutils = require(root + 'util/listutil')
 , logfac = require(root + 'app/models/services/prices/logfactory')
 , marketHistory = []
 , async = require('async')
 , lastLogged = {}     // used to check for changes 
 , executiondir = root + 'app/models/execution/'
 , bookutil = require(servicedir + 'book')
 , marketStatuses = {}
 , suspendedMarkets = []

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
	var self = this;
	async.forEach(books, self.investigate, function(err) {	
		if (err) {
			sysLogger.error('<priceobserver> <synchronize> ' + JSON.stringify(err));
		}
		if(suspendedMarkets.length) 
       		sysLogger.crit('<PriceObserver.prototype.synchronize> ' + suspendedMarkets.length + ' suspended Markets');
       	for(var i = 0; i<suspendedMarkets.length; i++) {
       		self.emit('marketSuspension', suspendedMarkets[i]);	
       	}
       	suspendedMarkets = []; 
    });
} 

/**
* Send status for all markets
*/
PriceObserver.prototype.broadcastStatuses = function() {
	for (var mid in marketStatuses) {
	    if (marketStatuses.hasOwnProperty(mid)) {
	   		app.io.broadcast('status', marketStatuses[mid]);	
	    }
	}
}

/**
* Logs book and checks market status.
*/
PriceObserver.prototype.investigate = function(book, callback) {
	var self = this;
	async.waterfall([
			function(cb) {cb(null, book);}, 
			logPrices, 
			broadcastPrices,
			updateStatus
		], function(err, book) {
			if(err) {
				console.log(err);
		    	//sysLogger.error('<priceobserver> <investigate> Error: ' + err);	  
		    	return; 
		    } 	
		    callback(null); 	    	    
		});				
} 

/**
* Updates Market Status and triggers 
* event if status changes from 'OPEN' 
* to 'SUSPENDED'
*/
function updateStatus(book, callback) {
	var mid = book.marketId;
	var status = {id: mid, status: book.status};
	if(marketStatuses[mid]) {
		if(marketStatuses[mid].status != book.status) {
			// Status has changed: braodcast
			app.io.broadcast('status', status);
			if(marketStatuses[mid].status == 'OPEN' && book.status == 'SUSPENDED') {
				sysLogger.crit('<priceobserver> <updateStatus> marketstatuses[mid].status = ' + marketStatuses[mid].status + ', book.status = ' +book.status ); 
				passivate(mid);
				// IDs of suspended markets have to be buffered 
				// as no event emission is possible from here	
				suspendedMarkets.push(mid);	
			}
		}		
	} else {
		// No status set yet
		app.io.broadcast('status', status);
	}	
	marketStatuses[mid] = status;
	callback(null, book);
}





/**
* Logs prices if logging is enabled in configs 
*/
function logPrices(book, callback) {
	if(!rtc.getConfig('api.showHistory')) {
		callback(null, book);
		return;
	} else {
		doLogging(book, callback);
	}
}

/**
* Log price information with a winston logger.
*/
function doLogging(book, callback) {
	var logobj = bookutil.getPriceInformation(book);
	logfac.getLogInstance(book.marketId, function(logger) {
		if(logger == null) callback(new Error('Could not initialize logger')); 
		var s1 = JSON.stringify(lastLogged[book.marketId]);	
		s1 = s1 != undefined ? s1.substring(s1.indexOf("message"), s1.length) : 'undefined';
		var s2 = JSON.stringify(logobj);
		s2 = s2 != undefined ? s2.substring(s2.indexOf("message"), s2.length) : 'undefined';
		if(s1 != s2) { 
			sysLogger.notice('<priceobserver> <doLogging> Price update for id = ' + book.marketId); 
			lastLogged[book.marketId] = logobj; 
			logger.info('' , logobj);
		} 
		callback(null, book);
	});
}

/**
* Broadcasts market book
*/
function broadcastPrices(book, callback) {
	var mid = book.marketId.substring(2,book.marketId.length);		
	app.io.broadcast('tick_' + mid, book);
	callback(null, book);
}

/**
* Remove winston logger from factory - if logging is enabled
*/
function passivate(marketId) {
	if(!rtc.getConfig('api.showHistory')) {
		logfac.removeLogInstance(marketId);		
	}
}

module.exports = PriceObserver;