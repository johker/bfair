
 /** Local version of active markets - STORED BY EVENT DATE ASCENDING */
var env = process.env.NODE_ENV || 'development'
 , root = '../../../'
 , servicedir = root + 'app/models/services/'
 , config = require(root + 'config/config')[env]
 , EventEmitter = require('events').EventEmitter
 , util = require('util')
 , sync = require(servicedir + 'markets/synchronize') 
 , strutils = require(root + 'util/stringutil')
 , listutils = require(root + 'util/listutil')
 , cachedmarkets = {}
 , logCounter
 , mid = 'marketId'

/**
* MarketObserver Constructor 
*/
var MarketObserver = function MarketObserver () {
	logCounter = 0
 };
 
util.inherits(MarketObserver, EventEmitter);
 
/**
* Return locally stored markets list
* TODO: use undescore
*/
MarketObserver.prototype.getList = function() {
	sysLogger.info('<marketObserver> <getList> size = ' + listutils.count(cachedmarkets));
	var innerArray = [];
	for (property in cachedmarkets) {
	    innerArray.push(cachedmarkets[property]);
	}
	return innerArray;
}

/**
* Return locally stored markets list size
*/
MarketObserver.prototype.getSize = function() {
	return listutils.count(cachedmarkets);
}

/**
* Return number of markets that are marked for price logging 
*/ 
MarketObserver.prototype.getLogCount = function() {
	return logCounter;
} 

/**
* Emits event with stale market and remove it from the list. 
*/
MarketObserver.prototype.remove = function(id) {
	var self = this;
	sysLogger.debug('<marketobserver> <remove> id = ' + id + ', date: ' + cachedmarkets[id].event.openDate);
	logCounter--;  
 	app.io.broadcast('removemarket', cachedmarkets[id]);
 	self.emit('stopLogging', cachedmarkets[id]);	
	delete cachedmarkets[id]; 	
}

/**
* Emits event with new market and adds it to the list.
*/ 
MarketObserver.prototype.add = function(market, id) {
	var self = this;
	cachedmarkets[id] = market;
	sysLogger.debug('<marketobserver> <add> id = ' + id + ', date: ' + market.event.openDate); 
	cachedmarkets[id]['activationTime'] = Date.now();	
	logCounter++; 
	app.io.broadcast('addmarket', cachedmarkets[id]);	
	self.emit('logPrices', market);
	logCounter++;                   
	                              
}

/**
* Update lastRefresh and totalMatched of exisiting markets. Emit 
* event for every updated market. 
*/
MarketObserver.prototype.update = function(market, id) {
	sysLogger.debug('<marketobserver> <update> id = ' + id); 
	app.io.broadcast('updatemarket', cachedmarkets[id.valueOf()]);	   
}


/**
* Synchronize and find the delta of markets by its id
*/ 
MarketObserver.prototype.synchronize = function(incoming) {
	var self = this;	
	sysLogger.debug('<marketobserver> <synchronize>'); 
	self.sort(incoming);
	sync.markets(cachedmarkets, incoming, mid, self);
    app.io.broadcast('updatecounters', {active: self.getSize(), logged: self.getLogCount()});	
    init = false;
}


/**
* Sort incoming markets by eventDate ascending, by marketId
* ascending for equal eventDates
* DEPRECATED
*/
MarketObserver.prototype.sort = function(markets) {
	markets.sort(function(first, second) {
     	var dtime = first.event.openDate - second.event.openDate;
     	var did = first.marketId - second.marketId;
     	var res = dtime != 0 ? dtime : did
     	return res; 
     });
}

module.exports = MarketObserver;