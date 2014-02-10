/**
 * New node file
 */
var root = '../../../../'
 , servicedir = root + 'app/models/services/'
 , rtc = require(root + 'app/controllers/configcontroller')
 , marketrequests = require(servicedir + 'markets/marketrequests')
 , results = []
 
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
		result['suspensiontime'] = new Date();
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
					results.push(result);  
					sysLogger.crit('<reporting> <addMarketToResults> Braodcasting result: ' + JSON.stringify(result));
					app.io.broadcast('updateresults', result);
	       			cb(null);
				});
			}); 
		});		
				
	}); 	
 }
 
 /**
 * Compares Results from RSS with suspended markets
 * to calculate profit/loss
 * @param results - Market description and winner
 */ 
 exports.assignWinners = function(winners) {
 	for(var i = 0; i < winners.length; i++) {
 		var idinfo = findIdByDescription(winners[i].string); 
		 if(idinfo != null) {
		 	var idx = idinfo.idx;
		 	var result = results[idx];
		 		var totalProfit = calculateProfit(winners[i], result);
		 		app.io.broadcast('totalProfit', {'totalProfit': totalProfit, marketId: idx, winners: winners[i].winners});
		 }
 	} 
 }
 
 /**
 * 
 * @param - winners of market
 * @param - result of market - containing sid mapped profit/losses
 */
 function calculateProfit(winners, result) {
 	var plrunners = result.runners;
 	var totalProfit = 0;
 	for(var sid in plrunners) {
 		if(plrunners.hasOwnPropety(sid)) {
 			// Check if runner has won
 			// TODO: check multiple winners
 			sysLogger.crit('<reporting> <calculateProfit> winners.winners = ' + winners.winners + ' plrunners[sid].name = ' + plrunners[sid].name);
 			if(winners.winners.indexOf(plrunners[sid].name)) { 
 				totalProfit += plrunners[sid].outcomes.potWin;
 			} else {
 				totalProfit += plrunners[sid].outcomes.potWin;
 			}
 		}
 	} return totalProfit;
 }
 
  /**
 * Looks for description in results to return the 
 * market ID
 * @param description - contains country, type and place 
 * @return marketId and index of matched market - null if no market in results for market description found
 */ 
 function findIdByDescription(description) {
 sysLogger.crit('<reporting> <findIdByDescription> description = ' + description);
 	for(var i in results) {
 	if (description.indexOf(results[i].countryCode)
 		&& description.indexOf(results[i].marketName)
 		&& description.indexOf(results[i].marketType)) {
 			sysLogger.crit('<reporting> <findIdByDescription> '
 			+ 'Contains ' + results[i].countryCode + ' = ' + description.indexOf(results[i].countryCode)
 			+ ' Contains ' + results[i].marketType + ' = ' + description.indexOf(results[i].marketType)
 			+ ' Contains ' + results[i].marketName + ' = ' + description.indexOf(results[i].marketName));
 			return {mid: marketId, idx: i};
 		}
 	}
 	return null; 
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
				var result = {outcomes: sidMappedPL[sid].outcomes, name: marketdescription.runners[i].runnerName}; 
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



/**
* Returns 
*/
exports.getResultList = function() {
	sysLogger.crit('<reporting> <getResultList> Number of results: ' + results.length);
	return results; 
}

