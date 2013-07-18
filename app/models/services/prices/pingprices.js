	
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

/*
* Ping Constructor 
*/
var Ping = function Ping (opts) {
    this.timeout = opts.timeout || config.api.timeout; 
    this.handle = null;
    this.session = opts.session;
    this.marketIds = [];
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

Ping.prototype.addMarketId = function(marketId) {
	sysLogger.info('<pingPrices> <addMarketId> id = ' + marketId); 
	this.marketIds.push(marketId);
}

Ping.prototype.removeMarket = function(market) {
	listutils.removeByAttr(this.markets, 'marketId', market.marketId);
}

Ping.prototype.ping = function() {
	var self = this;
	currentTime = Date.now();
	try {
		if(env == 'test') {
			for(var i in this.marketIds) {
				pricemock.getPrices(this.marketIds[i], function(prices, err) {
		           	self.emit('ping', prices);
		        });
	        }
	   } else {
	   		if(this.marketIds.length > 0) { 	
		   		var filter = {"marketIds": this.marketIds, "priceProjection":{"priceData":["EX_BEST_OFFERS"]}}
	           	pricerequest.listMarketBook(filter, function(err, res) {           		
		        	self.emit('ping', res.response.result);
		        });
		    }
        }     		  
    } catch (err) {
       sysLogger.error('<pingprices> <ping> ' + err);
       sysLogger.error(err.stack);
     }
}



module.exports = Ping;