/**
 * Usage behavior representation of market ids
 */

var env = process.env.NODE_ENV || 'development'
 , root = '../../../'
 , config = require(root + 'config/config')[env]




 exports.Market = function (id, name, d, eventId, eventName) {
 	sysLogger.debug('<marketfactory> <market> New Market generated with id = ' + id);
 	this.id = id;
 	this.name = name;  	
 	this.openDate = d.getTime();
 	this.eventId = eventId; 	
 	this.eventName = eventName;
 	this.activationTime = Date.now();  	

 	
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
 		return ++(this.nrct) > config.api.removeBuffer; 
 	} 	
 	
 	this.setPassivationTime = function(time) {
 		this.passivationTime = time;
 	}
 	
 	

 }