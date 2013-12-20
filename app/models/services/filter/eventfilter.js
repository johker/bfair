
/**
 * Module Dependencies
 */
var root = '../../../../'
 	, rtc = require(root + 'app/controllers/configcontroller')
 	, _ = require('underscore'); 
 	
var keysmpl = ['Lobkov', 'Djokovic', 'Murray', 'Federer', 'Ferrer', 'Nadal', 'Berdych', 'Tsonga', 'Del Potro', 'Gasquet', 'Wawrinka', 'Haas', 'Cilic', 'Nishikori', 'Tipsarevic', 'Raonic', 'Almagro', 'Simon', 'Kohlschreiber', 'Querrey', 'Monaco']
var keysfpl = ['Williams', 'Azarenka', 'Sharapova', 'Radwanska', 'Errani', 'Li', 'Kerber', 'Kvitova', 'Wozniacki', 'Kirilenko', 'Vinci', 'Ivanovic', 'Petrova', 'Stosur', 'Bartoli', 'Jankovic', 'Stephens', 'Cibulkova', 'Suarez Navarro', 'Flipkens']
var nkeystennis = ['Specials'];
var keysteams = ['England', 'FC Arsenal', 'FC Chelsea', 'FC Everton', 'Aston Villa', 'FC Fulham', 'FC Liverpool', 'Manchester City', 'Manchester United', 'Newcastle United', 'Norwich City', 'Queens Park Rangers', 'Reading FC', 'Southampton FC', 'Stoke City', 'AFC Sunderland', 'Swansea City', 'Tottenham Hotspur', 'West Bromwich Albion', 'West Ham United', 'Wigan Athletic'];
var nkeyssoccer = ['U21', 'U19'];
var tennis = {'male': keysmpl, 'female': keysfpl, 'negative': nkeystennis};
var soccer = {'teams': keysteams, 'negative': nkeyssoccer};
 
/**
* Takes first n entries from male and female player 
* arrays where n is specified by maxIndex. 
*/ 
function tennisKeys() {
	return tennis.male.slice(0,rtc.getConfig('api.filter.maxEvIdx.tennis'))
		.concat(tennis.female.slice(0, rtc.getConfig('api.filter.maxEvIdx.tennis')));
}

function negativeTennisKeys() {
	return tennis.negative;
}

/**
* Takes first n entries from soccer keys. 
*/ 
function soccerKeys() {
	return soccer.teams.slice(0,rtc.getConfig('api.filter.maxEvIdx.soccer'))
}

function negativeSoccerKeys() {
	return soccer.negative;
}
 	
 	
/**
* Removes object attributes without a name containing 
* a key word.
* HOW TO FILTER BY TABU WORDS?
*/ 
function byKeys(events, keys, nkeys) {
	return resf = _.filter(events, function(obj) {
		var ret; 
		for(var i in keys) {
			ret = ret || ~obj.event.name.toLowerCase().indexOf(keys[i].toLowerCase())
		}
		return ret;
	});
 } 
 
 /**
* Removes events with a low number of markets. Serves as
* a measure of importance.. 
*/ 
function byMarketCount(events) {
	return resf = _.filter(events, function(obj) {
		return obj.marketCount >= rtc.getConfig('api.filter.minMarketCt');
	});
 } 
 



/**
* Removes events that do not match the filter 
* criteria according to its event type. The criterias make assumptions 
* about the filter. 
*/
 exports.getFilteredEventIds = function(events) {
 	var mids = [];
 	var resf = [];
 	
 	// Tennis
 	if(rtc.getConfig('api.eventType') == '2') {
 		resf = byKeys(events, tennisKeys(), negativeTennisKeys());
 		
 	// Soccer		
	} else if(rtc.getConfig('api.eventType') == '1') {
		resf = byKeys(events, soccerKeys(), negativeSoccerKeys());
		
	// Greyhound Racing		
	} else if(rtc.getConfig('api.eventType') == '4339') {
		resf = events; // no filter
		
	// Horse Racing
	} else if(rtc.getConfig('api.eventType') == '7') {
		resf = byMarketCount(events); // Focus on Events with many markets
		
	// Default
	} else {
		resf = events; // No filter
	}
	
	if(resf.length == 0) {
		throw new Error("<eventfilter> <getFilteredMarketIds> No Events left after applied filter. ");
	}
	
	for(var i in resf) {
		mids.push(resf[i].event.id);	
	}

	return mids;
 }
 
 
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

Date.prototype.addMinutes= function(min){
    this.setMinutes(this.getMinutes()+min);
    return this;
}

exports.getEventFilter = function() {
	var eventFilter = {"filter": {"eventTypeIds" : [rtc.getConfig('api.eventType')], "turnsInPlay" : rtc.getConfig('api.filter.turnsInPlay')}};
	eventFilter.filter['marketStartTime'] = {};
	var earliestStart = new Date()
 							.addHours(-rtc.getConfig('api.filter.afterStDateBiasHrs') + rtc.getConfig('timezoneShiftGMT'))
 							.addMinutes(-rtc.getConfig('api.filter.afterStDateBiasMin'))
	var latestStart = new Date()
 							.addHours(rtc.getConfig('api.filter.beforeStDateBiasHrs') + rtc.getConfig('timezoneShiftGMT'))
 							.addMinutes(rtc.getConfig('api.filter.beforeStDateBiasMin'))
	if(rtc.getConfig('api.filter.applyAfterStDate') && rtc.getConfig('api.filter.applyBeforeStDate')) {
 		eventFilter.filter['marketStartTime'] = {"from": earliestStart,"to": latestStart}
 	} else if(rtc.getConfig('api.filter.applyAfterStDate')) {
 		eventFilter.filter['marketStartTime'] = {"from": earliestStart};
 	} else if(rtc.getConfig('api.filter.applyBeforeStDate')) {
 		eventFilter.filter['marketStartTime'] = {"to": latestStart};
 	}
 	
 	return eventFilter; 
}
 
 
 