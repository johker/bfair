/**
 * Stores information about current orders and available theoretical prices
 */

  /** Local version of active markets - STORED BY EVENT DATE ASCENDING */
var env = process.env.NODE_ENV || 'development'
 , root = '../../../../'
 , servicedir = root + 'app/models/services/'
 , listutils = require(root + 'util/listutil')    
 , theoreticals = {}
 , markets = []
 , orderrequests = require(servicedir + 'orders/orderrequests') 
 , plcalculation = require(servicedir + 'orders/plcalculation')
 , reporting = require(servicedir +  'results/reporting') 
 
 /**
* OrderObserver Constructor 
*/
var OrderObserver = function OrderObserver() {
	 
};
 
 
/**
* Broadcasts socket event with current orders for every
* SID. If report flag is set, orders are broadcasted. 
* Callback function is invoked with mapping of current orders by SIDs 
* @param mid - Market ID to look into
* @param report - if true, orders are reported to detail page
* @param cb - callback function
*/
OrderObserver.prototype.updateCurrentOrderInformation = function(marketId, report, cb) {
	orderrequests.listCurrentOrders({"marketIds":[marketId],"placedDateRange":{},"orderBy":"BY_MARKET"}, function(err, data) {
		if(err) {
			sysLogger.crit('<orderobserver> <listCurrentOrders> Error: ' + err.message);
			cb(err);
		}
		var currentBets = data.response.result.currentOrders;
		var sidBets = {}; 
		var mid = marketId.substring(2,marketId.length);
		for(var i = 0; i < currentBets.length; i++ ) {
			
			var sid = currentBets[i].selectionId;
			if (sidBets[sid] == undefined) {
				sidBets[sid] = [];
			}
			sidBets[sid].push(currentBets[i]);
			if(report) {
				app.io.broadcast('addorder_'+mid, currentBets[i]);		
			}		
		}
		cb(err, sidBets, currentBets.length);		
	});
} 


/**
* Creates P/L summaries for orders. If report flag is true, orders are 
* reported to results page. 
* @param sidMappedOrders - Mapping of current orders by SIDs
* @param report - if true, orders are reported to results page.  
* @param cb - callback function
*/ 
OrderObserver.prototype.updateProfitLoss = function(sidMappedOrders, report, cb) {	
	plcalculation.profitLoss(sidMappedOrders, function(err, sidMappedPL) { 
		if(err) cb(err); 
		sysLogger.debug('<orderobserver> <updateCurrentOrderInformation> ' + JSON.stringify(sidMappedPL)); 
		if(report) { 
			 // Broadcast to results page
			 for(var sid in sidMappedPL) {
			 	if(sidMappedPL.hasOwnProperty(sid)) {
			 		app.io.broadcast('profitloss', sidMappedPL[sid]);
				}
			}
		}
		cb(null, sidMappedPL); 
	});
}



 
/**
* Return list of theoretical prices
* TODO: use undescore
*/
OrderObserver.prototype.getTheoreticalsList = function() {	
	var innerArray = [];
	for (property in theoreticals) {
	    innerArray.push(theoreticals[property]);
	}
	return innerArray;
}

OrderObserver.prototype.getMarketsWithOrders = function() {
	var self = this; 
	sysLogger.info('<orderobserver> <getMarketsWithOrders> ' + JSON.stringify(markets));
	return markets;
}


/**
* Emits event with stale market and remove it from the list +
* if not-retrieved limit exceeded. 
*/
OrderObserver.prototype.remove = function(theoretical) {
	var self = this;
	app.io.broadcast('removebadge', theoreticals[theoretical.marketId]);	
	theoreticals[theoretical.selectionId].remove(); 
}

/**
* Emits events with id/theoretical of a market for which a 
* theoretical is available and adds it to the list.
* @param theoretical - DTO of theoretical
* @param cb - callback function
*/ 
OrderObserver.prototype.updateTheoreticals = function(theoretical, cb) {
	var self = this;
	try {
		if(markets.indexOf(theoretical.marketId) == -1) {
			sysLogger.info('<OrderObserver> <update> Push Market ID : ' + theoretical.marketId);	
			app.io.broadcast('addbadge', theoretical.marketId);
			markets.push(theoretical.marketId);
		}
		theoreticals[theoretical.selectionId] = theoretical;
		cb();
	} catch(err) {
		cb(err);
	}
}


module.exports = OrderObserver;

