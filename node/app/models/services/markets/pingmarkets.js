/**
 * Pings prices or markets - depending on the type that was
 * passed to the constructor
 */
var root = '../../../../'
	, EventEmitter = require('events').EventEmitter
	, util = require('util')
	, servicedir = root + 'app/models/services/'
 	, rtc = require(root + 'app/controllers/configcontroller')
	, pricemock = require(root + 'test/mock/pricefactory')
	, marketmock = require(root + 'test/mock/marketfactory')
	, marketrequest = require(servicedir + 'markets/marketrequests')
	, utils = require(root + 'util/stringutil')
	, events = require('events')
	, eventfilter = require(servicedir + 'filter/eventfilter')

/*
* Ping Constructor 
*/
var Ping = function Ping (opts) {
    this.eventType = opts.eventType || rtc.getConfig('api.eventType'); 
    this.timeout = opts.timeout || rtc.getConfig('api.baseto.market'); 
    this.handle = null;
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
    if(rtc.getConfig('mock.usemarkets')) {           	       	
      	marketmock.getMarkets(function(markets, err) {
       		self.emit('ping', markets);
       	});      		         		
	} else {
     	marketrequest.listMarkets(eventfilter.getEventFilter(), function(err, res) {
     		self.emit('ping', res);
	   });
    }           
   
}



Ping.prototype.intitialRequest = function() {
	var self = this;
	marketrequest.listMarkets(eventfilter.getEventFilter(), function(err, res) {
     		self.emit('ping', res);
	 });
};


module.exports = Ping;