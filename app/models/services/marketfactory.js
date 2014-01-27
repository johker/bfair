/**
 * Usage behavior representation of market ids
 */

var root = '../../../'
 , rtc = require(root + 'app/controllers/configcontroller')
 , servicedir = root + 'app/models/services/'	
 , marketemulation = require(servicedir + 'markets/marketemulation')
 , stringutil = require(root + 'util/stringutil');


 exports.Market = function (id, name, startTime, marketOpenDate, eventId, eventName, countryCode) {
 	sysLogger.debug('<marketfactory> <market> New Market generated with id = ' + id);
 	this.id = id;
 	this.name = name;  	
 	this.startTime = startTime.getTime();
 	this.openDate = marketOpenDate.getTime();
 	this.eventId = eventId; 	
 	this.eventName = eventName;
 	this.countryCode = countryCode;
 	this.activationTime = Date.now();  	
 	this.priceAvailable = false; // Theoeretical price available

 	marketemulation.enable(id); // Emulator registration
 	
 	this.reqct = 0; // Base ticks since last price request 
 	this.nrct = 0; // Request counts since id has not been retrieved 	
 	
 
 	this.isRequested = function() { 	
 		this.reqct++;
 	}
 	
 	this.resetReqCt = function() {
 		this.reqct = 0;
 	}
 	
 	this.getReqCt = function() {
 		return this.reqct;
 	}
 	
 	this.getId = function() {
 		return this.id;
 	}
 	
 	this.remove = function() {
 		return ++(this.nrct) > rtc.getConfig('api.removeBuffer'); 
 	} 	
 	
 	this.setPassivationTime = function(time) {
 		this.passivationTime = time;
 	}
 	
 	

 }