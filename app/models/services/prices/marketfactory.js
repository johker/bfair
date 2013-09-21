/**
 * Usage behavior representation of market ids
 */

 exports.Market = function (id) {
 	sysLogger.debug('<marketfactory> <market> New Market generated with id = ' + id);
 	this.id = id;
 	this.reqct = 0; 
 
 
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
 	
 	
 	
 	

 }