/**
 * Timeout adjsutment based on importance of market. Markets are divided by totalMatched factor in 
 * categories. 
 *  
 */ 

var root = '../../../'
	, rtc = require(root + 'app/controllers/configcontroller')
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
	if(value > rtc.getConfig('api.throttle.th3')) {
		return C4;
	} 
	if (value > rtc.getConfig('api.throttle.th2')) {
		return C3;
	}
	if (value > rtc.getConfig('api.throttle.th1')) {
		return C2;
	}
	return C1;
}

exports.sort = function() {
	this.classes = _.sortBy(classes, function(item){ return  item.thrclass});
}

exports.ready = function(market) {
	var timeout = calcTimeout(market.getReqCt());
	return timeout >= (getThrottleFactor(market.getId()) * rtc.getConfig('api.baseto.price'));
}

function getThrottleFactor(mid) {
	var match = _.find(classes, function(item) { return item.id === mid});
	if(!match) {
		throw new Error('Market ID ' + mid + ' cannot be found in throttle classes.'); 
	}
	var fac = rtc.getConfig('api.throttle.fac1'); 
	switch(match.thrclass) {
		case C1: 
		fac = rtc.getConfig('api.throttle.fac1'); 
		break;
		case C2: 
		fac = rtc.getConfig('api.throttle.fac2'); 
		break;
		case C3: 
		fac = rtc.getConfig('api.throttle.fac3'); 
		break;
		case C4: 		
		fac = rtc.getConfig('api.throttle.fac4'); 
		break;
	}
	return fac;  	
}


function calcTimeout(reqct) {
	return reqct * rtc.getConfig('api.baseto.price');
}  
