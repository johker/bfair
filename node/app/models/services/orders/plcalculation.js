/**
 * In-Play specific runner Profit And Loss calculation formula
 */
var env = process.env.NODE_ENV || 'development'
 , root = '../../../../'
 , servicedir = root + 'app/models/services/'
 , _ = require('underscore')
 , listutils = require(root + 'util/listutil')
 , nu = require(root + 'util/numberutil')      
 
/**
* @param sidBets - Mapping of current orders by SIDs
* @return sidMappedRes - Mapping of Profit/Loss figures by SID
*/
exports.profitLoss = function(sidBets, cb) {
	var idx = 0;
	var sidMappedRes = {};
	for(var sid in sidBets) {
	  if (sidBets.hasOwnProperty(sid)) {
         	split(sidBets[sid], function(backbets, laybets) {
         		var backPriceSize = getVolumneWeightedPriceSize(backbets);
         		var layPriceSize = getVolumneWeightedPriceSize(laybets);
         		var result = {};
         		result['sid'] = sid; 
         		result['liabilities'] = runnerLiability(backPriceSize['size'], layPriceSize['size'], layPriceSize['price']);
         		result['outcomes'] = potOutcome(backPriceSize['size'], backPriceSize['price'], layPriceSize['size'], layPriceSize['price']);
         		sidMappedRes[sid] = result;
         	});
      }
      idx++;
   }
	sysLogger.debug('<plcalculation> <profitLoss> sidMappedRes = ' + JSON.stringify(sidMappedRes));
   cb(null, sidMappedRes);
}
 
/**
* Splits an array of bets by its sides 
*/
function split(bets, cb) {
	var backbets = _.filter(bets, function(obj) {
		return ~obj.side.toUpperCase().indexOf("BACK");
	});	
	var laybets = _.filter(bets, function(obj) {
		return ~obj.side.toUpperCase().indexOf("LAY");
	});	
	cb(backbets, laybets);
}
 
/**
* Returns the average price and total volume of bets of the same 
* side. If overall matched size is 0 it returns 0 for both values.
* @param array of bets (same side)
* @return object containing average price and total volume
*/
function getVolumneWeightedPriceSize(bets) {
	var sum = 0;
	var div = 0;
	for(var i = 0; i < bets.length; i++) {
		sum += bets[i].averagePriceMatched * bets[i].sizeMatched; 
		div += bets[i].sizeMatched; 
	}
	if(div != 0) {
		return {price : sum / div, size: div}; 
	} else {
		return {price : 0, size: 0};
	}
}

/**
* Calculates the liability assuming the worst possible outcome. 
* @param backBetSize
* @param layBetSize
* @param layBetPrice
*/
function runnerLiability(backBetSize, layBetSize, layBetPrice) {
	var backBetLiability = nu.roundToDigits(backBetSize,2);
	var layBetLiability = nu.roundToDigits(layBetSize * (layBetPrice - 1),2);
	var totalLiability = nu.roundToDigits(Math.abs(backBetLiability - layBetLiability),2);
	return {backBetLiability: backBetLiability, layBetLiability: layBetLiability, totalLiability: totalLiability};
}

/**
* Calculates possible profits. 
* @param backBetSize
* @param backBetPrice
* @param layBetSize
* @param layBetPrice
*/
function potOutcome(backSize, backPrice, laySize, layPrice) {
	var potWin = nu.roundToDigits(backSize * (backPrice - 1) - (laySize * (layPrice - 1)),2);
	var potLoss = nu.roundToDigits(laySize - backSize,2);
	return {potWin: potWin, potLoss: potLoss}; 
}

