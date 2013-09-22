/**
 * Timeout adjsutment based on importance of market. Markets are divided by totalMatched factor in 
 * categories. 
 *  
 */ 

var env = process.env.NODE_ENV || 'development'
	,  root = '../../../'
	, config = require(root + 'config/config')[env]
	, _ = require('underscore')	
	, classes = [];
	
	
var C1 = 1
  , C2 = 2
  , C3 = 3
  , C4 = 4
	
	
/** 
* Start at lowest category 
*/ 	
exports.addMarket = function(market) {
	var mid = market.getId();
	sysLogger.debug('<throttle> <addMarket> ID = ' + mid); 
	classes.push({id: mid, thrclass: C1}); 
}

exports.removeMarket = function(market) {
	var mid = market.getId();
	sysLogger.debug('<throttle> <removeMarket> ID = ' + mid);
	_.without(classes, _.findWhere(classes, {id: mid}));
	
}

exports.updateMarket = function(id, value) {
	var match = _.find(classes, function(item) { return item.id === id});
	if(!match) {
		throw new Error('Market ID ' + mid + ' cannot be found in throttle classes.'); 
	}
	if(value > config.api.throttle.th1) {
		match.thrclass = C2;
	} else if (value > config.api.throttle.th2) {
		match.thrclass = C3;
	} else if (value > config.api.throttle.th3) {
		match.thrclass = C4;
	}
	if(id == '1.107453578') {
		sysLogger.crit('<throttle> <updateMarket> class = ' + match.thrclass + 'value = ' + value); 
	}
	return match.thrclass;
}

exports.sort = function() {
	this.classes = _.sortBy(classes, function(item){ return  item.thrclass});
}

exports.ready = function(market) {
	var timeout = calcTimeout(market.getReqCt());
	return timeout >= (getThrottleFactor(market.getId()) * config.api.baseto.price);
}

function getThrottleFactor(mid) {
	var match = _.find(classes, function(item) { return item.id === mid});
	if(!match) {
		throw new Error('Market ID ' + mid + ' cannot be found in throttle classes.'); 
	}
	var fac = config.api.throttle.fac1; 
	switch(match.thrclass) {
		case C1: 
		fac = config.api.throttle.fac1; 
		break;
		case C2: 
		fac = config.api.throttle.fac2; 
		break;
		case C3: 
		fac = config.api.throttle.fac3; 
		break;
		case C4: 		
		fac = config.api.throttle.fac4; 
		break;
	}
	return fac;  	
}


function calcTimeout(reqct) {
	return reqct * config.api.baseto.price;
}  
