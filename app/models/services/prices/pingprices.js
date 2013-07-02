	
var env = process.env.NODE_ENV || 'development'
	,  root = '../../../../'
	, EventEmitter = require('events').EventEmitter
	, util = require('util')
	, servicedir = root + 'app/models/services/'
 	, config = require(root + 'config/config')[env]
	, pricemock = require(root + 'test/mock/pricefactory')
	, marketmock = require(root + 'test/mock/marketfactory')
	, strutils = require(root + 'util/stringutil')
	, listutils = require(root + 'util/listutil')
	, events = require('events')

/*
* Ping Constructor 
*/
var Ping = function Ping (opts) {
    this.timeout = opts.timeout || config.api.timeout; 
    this.handle = null;
    this.session = opts.session;
    this.request = opts.request;
    this.markets = [];
};

util.inherits(Ping, EventEmitter);

Ping.prototype.start = function() {
	var self = this,
    time = Date.now(); 
    sysLogger.debug('<pingprices> <start> type ID ' + self.eventType + ', date: ' + strutils.getFormatedDate(time));
 	// create an interval for pings
    self.handle = setInterval(function () {
       self.ping();
    }, self.timeout);
};

Ping.prototype.stop = function() {
	clearInterval(this.handle);
    this.handle = null;
};

Ping.prototype.addMarket = function(market) {
	sysLogger.info('<pingPrices> <addMarket> id = ' + market.marketId); 
	this.markets.push(market);
}

Ping.prototype.removeMarket = function(market) {
	listutils.removeByAttr(this.markets, 'marketId', market.marketId);
}

Ping.prototype.ping = function() {
	var self = this;
	currentTime = Date.now();
	try {
		for(var i in this.markets) {
		if(env == 'test') {
			pricemock.getPrices(this.markets[i].marketId, function(prices, err) {
	           	self.emit('ping', prices);
	        });
	       } else {
           	self.request(this.markets[i].marketId, function(markets, err) {
	        	self.emit('ping', markets);
	        });
        }     
		}  
    } catch (err) {
       sysLogger.error('<pingprices> <ping> ' + err);
       sysLogger.error(err.stack);
     }
}

module.exports = Ping;