/**
 * New node file
 */
var root = '../../../../'
 , servicedir = root + 'app/models/services/'
 , rtc = require(root + 'app/controllers/configcontroller')
 , marketrequests = require(servicedir + 'markets/marketrequests')
 , _ = require('underscore') 
 , su = require(root + 'util/stringutil')
 , dbresults = require(root + 'app/models/db/db_results');

 
  /**
 * Adds aggregated P/L report for market to results page.
 * @param orderobserver - instance of orderobserver
 * @param marketId
 * @param cb - callback function
 */
 exports.addMarketToResults = function(orderobserver, marketId, cb) {
 	var self = this;
 	var result = {};  	
 	// TODO: waterfall method 
 	
	// Report for passivated market
	orderobserver.updateCurrentOrderInformation(marketId, false, function(err, sidBets, orderct) {
		sysLogger.crit('<reporting> <addMarketToResults> orderct = ' + orderct);
		if(orderct == 0) {
			cb(null); 
			return;
		} 
		result['orderct'] = orderct;
		result['marketId'] = marketId;
		result['suspensiontime'] = new Date().getTime();
		// Calculate Profit/Loss for runners
		orderobserver.updateProfitLoss(sidBets, false, function(err, sidMappedPL) {
			// Get relevant information for market: name, country, date
			//marketrequests.
			if(sidMappedPL == {}) {
				return cb(null);
			}
			marketrequests.listMarketCatalogue({"filter":{"marketIds":[marketId]},"maxResults":"1","marketProjection":["EVENT","MARKET_DESCRIPTION", "RUNNER_DESCRIPTION"]}, function(err, res) {
				try { 
					if(err) return cb(err);
					var marketdescription = res.response.result[0];
					result['marketName'] = marketdescription.event.name;
					result['marketType'] = marketdescription.marketName;
					result['countryCode'] = marketdescription.event.countryCode;
				} catch(err) {
					if (err) return cb(err);					
				}
  				mapOutcomesOnRunners(sidMappedPL, marketdescription, function(err, mappedOutcomes) {
					if (err) return cb(err);
					result['runners'] = mappedOutcomes;
					addResult(result);  					
	       			cb(null);
				});
			}); 
		});		
				
	}); 	
 }
 
 /**
 * Adds suspended market to DB results and emit event.
 * collection
 */
 function addResult(result) {
 	dbresults.add(result, function() {
 		app.io.broadcast('updateresults', result); 	
 		sysLogger.crit('<reporting> <addResult> Entry ' + JSON.stringify(result));
 	}) 
 }
 
 
  /**
 * Returns list of results from database
 * @param cb - callback function
 */
 exports.getResults = function(cb) {
 	dbresults.getList(function(results) {
 		cb(results);
 	}) 
 } 
 
 /**
 * Adds winner / profit information to 
 * suspended market: Event Emission / DB Update
 * @param resultinfromation {'totalProfit': Number, marketId: String, winners: Array}
 */ 
 function updateResult(resultInformation) {
 	dbresults.update(resultInformation.marketId, resultInformation.totalProfit, resultInformation.winners, function(updateddoc) {
 		sysLogger.crit('<reporting> <updateResult> resultInformation ' + JSON.stringify(resultInformation));
 		app.io.broadcast('totalProfit', resultInformation);
 	}); 
 } 
 
 /**
 * Compares Results from RSS with suspended markets
 * to calculate profit/loss
 * @param results - Market description and winner
 */  
 exports.assignWinners = function(winners) {
 	exports.getResults(function(results) {
 		for(var i = 0; i < winners.length; i++) {	
	 		var result = exports.checkForMatchingResults(results, winners[i].marketId); 
			 if(result != null && result.profit == null) {
			 	var totalProfit = calculateProfit(winners[i], result);
			 	var resultinformation = {'totalProfit': totalProfit, 'marketId': result.marketId, 'winners': winners[i].winners}
			 	updateResult(resultinformation);
			 }
 		} 
 	});
 	
 }
 

  /**
 * Compares winner obj with list of reuslts  - returns 
 * result with matching marketId if exists  
 * @param winnerMid - Market Id of RSS Winner
 * @param results - results list
 * @return result with matching id - null if no matching result exists  
 */ 
 exports.checkForMatchingResults = function(results, winnerMid) {
 	var match = _.filter(results, function(obj) {
	    return ~('' + obj.marketId).indexOf(winnerMid);
	});
	if(match.length != 1) {
		return null; 
	} else {
		return match[0];
	}
 }
 
 
 /**
 * 
 * @param - winners of market
 * @param - result of market - containing sid mapped profit/losses
 */
 function calculateProfit(winners, result) {
 	//sysLogger.crit('<reporting> <calculateProfit> result = ' + JSON.stringify(result) + ' winners = ' + JSON.stringify(winners));
 	var plrunners = result.runners;
 	//sysLogger.crit('<reporting> <calculateProfit> plrunners = ' + JSON.stringify(plrunners));
 				
 	var totalProfit = 0;
 	if(!plrunners) return;
 	for(var i = 0; i < plrunners.length; i++) {
 		// Check if runner has won
 		// TODO: check multiple winners
 		if(winners.winners.indexOf(plrunners[i].name)) { 
 			totalProfit += plrunners[i].potWin;
 		} else {
 			// potLoss < 0:
 			totalProfit += plrunners[i].potLoss;
 		}
 		
 	} return totalProfit;
 }
 
 /**
 * Remove positioning from runner name:
 * '5. Dos Oro' -> 'Dos Oro'
 *
 */
 function cleanRunnerName(name) {
 	return su.trim(name.substr(arr[1].indexOf('.') + 1, name.length-1));
 }
 
 
 /**
 * Maps p/l summaries on runner names and adds market description.
 *
 * @param sidMappedRes - Mapping of current p/l summaries by SIDs
 * @param marketdescription - market whose summaries are evaluated.  
 * @param cb - callback function
 */
function mapOutcomesOnRunners(sidMappedPL, marketdescription, cb) {
	var mappedOutcomes = {};
	try {
		for(var i = 0; i < marketdescription.runners.length; i++) {		
			var sid = marketdescription.runners[i].selectionId;	
			if(!sidMappedPL[sid]) {
				sysLogger.info('<reporting> <mapOutcomesOnRunners> No PL found for SID ' + sid + '!');
			} else {
				var result = {potWin: sidMappedPL[sid].outcomes.potWin, potLoss: sidMappedPL[sid].outcomes.potLoss, name: marketdescription.runners[i].runnerName, sid: sid}; 
				mappedOutcomes[sid] = result;	
				sysLogger.debug('<reporting> <mapOutcomesOnRunners> ' + sid + ':' + JSON.stringify(result));
			}			
		}
	} catch(err) {
		cb(err); 
		return;
	} 
	cb(null, mappedOutcomes);
}



