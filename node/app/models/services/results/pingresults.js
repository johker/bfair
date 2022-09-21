/**
 * Pings results
 */
var root = '../../../../'
	, EventEmitter = require('events').EventEmitter
	, util = require('util')
	, servicedir = root + 'app/models/services/'
 	, rtc = require(root + 'app/controllers/configcontroller')
	, resultrequest = require(servicedir + 'results/resultrequest')
	, utils = require(root + 'util/stringutil')

/*
* Ping Constructor 
*/
var Ping = function Ping() {
    this.timeout = rtc.getConfig('api.baseto.results'); 
    this.handle = null;
};

util.inherits(Ping, EventEmitter);

Ping.prototype.start = function() {
	var self = this,
    time = Date.now(); 
    sysLogger.critical("<pingresults> <start> Time: " + utils.getFormatedDate(time));
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
	resultrequest.listLatestResults(function(res){
		self.emit('ping', res);
	}); 
}



Ping.prototype.intitialRequest = function() {
	var self = this;
	// do request
};


module.exports = Ping;

rping = new Ping();

rping.on('ping', function(results) {
	sysLogger.critical('<apicontroller> <resultsping.on:ping>' + JSON.stringify(results));
});