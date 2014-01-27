/**
 * New node file
 */
var root = '../../../../'
 , servicedir = root + 'app/models/services/'
 , rtc = require(root + 'app/controllers/configcontroller')
 , marketrequests = require(servicedir + 'markets/marketrequests')

 
  /**
 * Adds aggregated P/L report for market to results page.
 * @param orderobserver - instance of orderobserver
 * @param marketId
 * @param cb - callback function
 */
 exports.addMarketToResults = function(orderobserver, marketId, cb) {
 	var self = this; 
	// Report for passivated market
	orderobserver.updateCurrentOrderInformation(mid, false, function(err, sidBets) {
		// Calculate Profit/Loss for runners
		orderobserver.updateProfitLoss(sidBets, false, function(err, sidMappedPL) {
			// Get relevant information for market: name, country, date
			//marketrequests.
			marketrequests.listMarketCatalogue({"filter":{"marketIds":[marketId]},"maxResults":"1","marketProjection":["EVENT","MARKET_DESCRIPTION"]}, function(err, res) {
				sysLogger.crit('<reporting> <addMarketToResults> Catalogue Res = ' + JSON.stringify(res));
  				aggregateRunners(sidMappedRes, marketId, function(err) {
					if (err) return cb(err);
	       			cb(null);
				});
			}); 
		});		
				
	}); 	
 }
 
 /**
 * Aggregates SID mapped p/l summaries 
 * @param sidMappedRes - Mapping of current p/l summaries by SIDs
 * @param marketId - market whose summaries are evaluated.  
 * @param cb - callback function
 */
function aggregateRunners(sidMappedRes, marketID, cb) {
	cb();

}

/**
*
*/
function addMarketPLSummary() {

}

