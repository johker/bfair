/**
 * Timeout adjsutment based on importance of market. Markets are divided by totalMatched factor in 
 * categories. 
 *  
 */ 

 var env = process.env.NODE_ENV || 'development'
	,  root = '../../../'
	, config = require(root + 'config/config')[env]
	, _ = require('underscore')	
	, cat1 = []
	, cat2 = []
	, cat3 = []
	, cat4 = []
	
/** 
* Start at lowest category 
*/ 	
exports.addMarket = function(market) {
	var mid = market.getId();
	sysLogger.debug('<throttle> <addMarketId> id = ' + mid); 
	cat1.push(mid);
}


exports.removeMarket = function(market) {
	var mid = market.getId();
	sysLogger.debug('<throttle> <removeMarketId> ' + mid);
	_.without(cat1, mid);
	_.without(cat2, mid); 
	_.without(cat3, mid); 
	_.without(cat4, mid);
}

exports.ready = function(market) {
	var timeout = calcTimeout(market.getReqCt());
	return timeout >= (getThrottleFactor(market.getId()) * config.api.baseto.price);
}

function getThrottleFactor(mid) {
	if(_.contains(cat1, mid)) {
		return config.api.throttle.fac1; 
	}
	if(_.contains(cat2, mid)) {
		return config.api.throttle.fac2; 
	}
	if(_.contains(cat3, mid)) {
		return config.api.throttle.fac3; 
	}
	if(_.contains(cat4, mid)) {
		return config.api.throttle.fac4; 
	}
}

function calcTimeout(reqct) {
	return reqct * config.api.baseto.price;
}  
