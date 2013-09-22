	
var env = process.env.NODE_ENV || 'development'
	,  root = '../../../../'
	, EventEmitter = require('events').EventEmitter
	, util = require('util')
	, servicedir = root + 'app/models/services/'
 	, config = require(root + 'config/config')[env]
	, pricemock = require(root + 'test/mock/pricefactory')
	, marketmock = require(root + 'test/mock/marketfactory')
	, strutils = require(root + 'util/stringutil')
	, pricerequest = require(servicedir + 'prices/pricerequests')
	, listutils = require(root + 'util/listutil')
	, events = require('events')
	, _ = require('underscore')
	, throttle = require(servicedir + 'throttle') 
	, batch = require(servicedir + 'batch')
	, marketfactory = require(servicedir + 'prices/marketfactory') 
	
/*
* Ping Constructor 
*/
var Ping = function Ping (opts) {
    this.timeout = opts.timeout || config.api.baseto.price; 
    this.handle = null;
    this.session = opts.session;
    this.marketIds = [];
    this.batchCt = batch.getBatchCt() || 1;
    this.reqct = 0; 
};

util.inherits(Ping, EventEmitter);

Ping.prototype.start = function() {
	var self = this,
    time = Date.now(); 
    sysLogger.debug('<pingprices> <start> date: ' + strutils.getFormatedDate(time));
 	// create an interval for pings
    self.handle = setInterval(function () {
       self.ping();
    }, self.timeout);
};

Ping.prototype.stop = function() {
	clearInterval(this.handle);
    this.handle = null;
};

Ping.prototype.addMarketId = function(mid) {	
	// Generate market object to track number of requests
	var market = new marketfactory.Market(mid);	
	batch.addMarket(market);
	throttle.addMarket(market);
}

Ping.prototype.removeMarketId = function(mid) {
	// Generate market object to track number of requests
	var market = new marketfactory.Market(mid);
	batch.removeMarket(market);
	throttle.removeMarket(market);
}

Ping.prototype.ping = function() {
	var self = this;
	sysLogger.debug('<pingprices> <ping> timeout = ' + self.timeout);
	try {
		if(env == 'test') {		
			pricemock.getPrices(batch.getNextBatch(), function(res, err) {
		           	self.emit('ping', res);
		    });
	     } else {
	   		if(batch.notEmpty()) { 	
	   			var markets = batch.getNextBatch();
	   			var marketIds = self.updateCounters(markets);
	   			if(marketIds.length > 0) {
	   				var filter = {"marketIds": marketIds, "priceProjection":{"priceData":["EX_BEST_OFFERS"]}}
		   				pricerequest.listMarketBook(filter, function(err, res) {
		   					if((++self.reqct / batch.getBatchCt()) >= config.api.throttle.thupdt == 0) {
		   						self.reqct = 0;
		   						self.updateCategories(res.response.result, markets); 
		   					}  
		   					self.emit('ping', res.response.result);
		        	});
	   			}
		    }
        }
		// adjust interval 
		self.updateInterval();
    } catch (err) {
       sysLogger.error('<pingprices> <ping> ' + err);
       sysLogger.error(err.stack);
     }
}


Ping.prototype.updateInterval = function() {
	var self = this;
	if(batch.getBatchCt() != self.batchCt) { 
			self.batchCt = batch.getBatchCt();
			clearInterval(self.handle);
			var newinterval = Math.round(config.api.baseto.price / self.batchCt);
			sysLogger.crit('<pingprices> <ping> Minimum interval changed to ' + newinterval + 'ms');
		    self.handle = setInterval(function () {
		       		self.ping();
		    	}, newinterval); 		
	}  
}

Ping.prototype.updateCounters = function(markets) {
	var ids = [];
	for(var i = 0; i < markets.length; i++) {
		markets[i].isRequested();
		if(throttle.ready(markets[i])) {
			markets[i].resetReqCt();
			ids.push(markets[i].getId());
		} 
	}
	return ids;
}


Ping.prototype.updateCategories = function(books) {
	var mid, tm, thrclass;  
	for(var i = 0; i < books.length; i++) {
		mid = books[i].marketId;
		tm = books[i].totalMatched;
		if(tm == 0) {
			continue;
		}
		thrclass = throttle.updateMarket(mid, tm);
		app.io.broadcast('updateclass', {mid: mid, thrclass: thrclass, tm: tm});	   
	}
	throttle.sort();
}


module.exports = Ping;