/**
 * Pings prices or markets - depending on the type that was
 * passed to the constructor
 */
var env = process.env.NODE_ENV || 'development'
	,  root = '../../../../'
	, EventEmitter = require('events').EventEmitter
	, util = require('util')
	, servicedir = root + 'app/models/services/'
 	, config = require(root + 'config/config')[env]
	, pricemock = require(root + 'test/mock/pricefactory')
	, marketmock = require(root + 'test/mock/marketfactory')
	, marketrequest = require(servicedir + 'markets/marketrequests')
	, utils = require(root + 'util/stringutil')
	, events = require('events');

/*
* Ping Constructor 
*/
var Ping = function Ping (opts) {
    this.eventType = opts.eventType || config.api.eventType; 
    this.timeout = opts.timeout || config.api.timeout; 
    this.handle = null;
    this.filter = opts.filter || {"filter": {"eventTypeIds" : [2], "turnsInPlay" : true}};
    this.session = opts.session;
};

util.inherits(Ping, EventEmitter);

Ping.prototype.start = function() {
	var self = this,
    time = Date.now(); 
    sysLogger.info("<pingmarkets> <start> type ID " + self.eventType + ", Time: " + utils.getFormatedDate(time));
 	// create an interval for pings
    self.handle = setInterval(function () {
       self.ping();
    }, self.timeout);
};


Ping.prototype.stop = function() {
	clearInterval(this.handle);
    this.handle = null;
};


Ping.prototype.ping = function(){
	var self = this;
	currentTime = Date.now(); 	
    if(env == 'test') {           	       	
      	marketmock.getMarkets(function(markets, err) {
       		self.emit('ping', markets);
       	});      		         		
	} else {
     	marketrequest.listMarkets(self.filter, function(err, res) {
     		self.emit('ping', res);
	   });
    }           
   
}


module.exports = Ping;