
 /** Local version of active markets - STORED BY EVENT DATE ASCENDING */
var env = process.env.NODE_ENV || 'development'
 , root = '../../../'
 , config = require(root + 'config/config')[env]
 , EventEmitter = require('events').EventEmitter
 , util = require('util')
 , strutils = require(root + 'util/stringutil')
 , listutils = require(root + 'util/listutil')
 , marketselector = require(root + 'app/models/services/marketselector')
 , listedmarkets = {}
 , logCounter
 

/**
* MarketObserver Constructor 
*/
var MarketObserver = function MarketObserver () {
	logCounter = 0
 };
 
util.inherits(MarketObserver, EventEmitter);
 
/**
* Return locally stored markets list
*/
MarketObserver.prototype.getList = function() {
	sysLogger.info('<marketObserver> <getList> size = ' + listutils.count(listedmarkets));
	var innerArray = [];
	for (property in listedmarkets) {
	    innerArray.push(listedmarkets[property]);
	}
	return innerArray;
}

/**
* Return locally stored markets list size
*/
MarketObserver.prototype.getSize = function() {
	return listutils.count(listedmarkets);
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
MarketObserver.prototype.removeStale = function(id) {
	var self = this;
	sysLogger.info('<marketobserver> <removeStale> id = ' + id + ', date: ' + strutils.millisToDate(listedmarkets[id].eventDate));
	if(listedmarkets[id]['isLogged']) logCounter--;  
 	app.io.broadcast('stalemarket', listedmarkets[id]);
 	self.emit('stopLogging', listedmarkets[id]);	
	delete listedmarkets[id]; 	
}

/**
* Emits event with new market and adds it to the list.
*/ 
MarketObserver.prototype.addNew = function(market, id) {
	var self = this;
	listedmarkets[id] = market;
	sysLogger.info('<marketobserver> <addNew> id = ' + id + ', date: ' + strutils.millisToDate(listedmarkets[id].eventDate)); 
	listedmarkets[id]['activationTime'] = Date.now();	
	self.markedForLogging(id);
	app.io.broadcast('newamarket', listedmarkets[id]);	
}

/**
* Checks if market id is of interest, sets logging flag. Emits event
* to start price logging. 
*/
MarketObserver.prototype.markedForLogging = function(id){
	var self = this;
	if(marketselector.marketOfInterest(listedmarkets[id])) {
		listedmarkets[id]['isLogged'] = true;	
		logCounter++;			
		self.emit('logPrices', listedmarkets[id]);				
	} else {
		listedmarkets[id]['isLogged'] = false;
	}
}

/**
* Update lastRefresh and totalMatched of exisiting markets. Emit 
* event for every updated market. 
*/
MarketObserver.prototype.update = function(market, id) {
	listedmarkets[id.valueOf()]['lastRefresh'] = market.lastRefresh; 	
	listedmarkets[id.valueOf()]['totalMatched'] = market.totalMatched;
	if(listedmarkets[id.valueOf()].totalMatched != market.totalMatched) {
		sysLogger.info('<marketobserver.update> <id = ' + id + ', totalMatched = ' + market.totalMatched + '>');
	}
	app.io.broadcast('updatemarket', listedmarkets[id.valueOf()]);	   
}


/**
* Synchronize and find the delta of markets by its id
*/ 
MarketObserver.prototype.synchronize = function(markets) {
	var self = this;
	self.sort(markets);	
	var mapN = listutils.mapFromArray(markets, 'marketId'); 
	for (var id in listedmarkets) {
        if (!mapN.hasOwnProperty(id)) {            
              self.removeStale(id);
    	}
    }
    for (var id in mapN) {
        if (!listedmarkets.hasOwnProperty(id)) {
     		   self.addNew(mapN[id], id);     		   
        } 
        else {
        	self.update(mapN[id], id);
        }
    }
    // update counters
    app.io.broadcast('updatecounters', {active: self.getSize(), logged: self.getLogCount()});	
    if(env == 'development') { 
    	// self.resultInfo();    	
    } 
    init = false;
}

/**
* Print additional infos for debugging.
*/
MarketObserver.prototype.resultInfo = function() {
	sysLogger.info('<marketobserver> <resultInfo> number: ' + listutils.count(listedmarkets) + ', id: ' + config.api.eventType);
}

/**
* Sort incoming markets by eventDate ascending, by marketId
* ascending for equal eventDates
*/
MarketObserver.prototype.sort = function(markets) {
	markets.sort(function(first, second) {
     	var dtime = first.eventDate - second.eventDate;
     	var did = first.marketId - second.marketId;
     	var res = dtime != 0 ? dtime : did
     	return res; 
     });
}

module.exports = MarketObserver;