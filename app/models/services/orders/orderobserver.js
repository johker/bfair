/**
 * Stores information about current orders and available theoretical prices
 */

  /** Local version of active markets - STORED BY EVENT DATE ASCENDING */
var env = process.env.NODE_ENV || 'development'
 , root = '../../../../'
 , servicedir = root + 'app/models/services/'
 , listutils = require(root + 'util/listutil')    
 , theoreticals = {}
 , orderrequests = require(servicedir + 'orders/orderrequests') 
 
 
 
 /**
* OrderObserver Constructor 
*/
var OrderObserver = function OrderObserver() {
 };
 
 
/**
* Sends socket event with current orders for every
* SID. 
* @param mid - Market ID to look into
*/
OrderObserver.prototype.updateCurrentOrderInformation = function(marketId) {
	orderrequests.listCurrentOrders({"marketIds":[marketId],"placedDateRange":{},"orderBy":"BY_MARKET"}, function(err, data) {
		var currentBets = data.response.result.currentOrders;
		var sidBets = []; 
		var mid = marketId.substring(2,marketId.length);		
		console.log(data.response.result);
		app.io.broadcast('clearorders_'+mid, mid);	
		for(var i = 0; i < currentBets.length; i++ ){
			var sid = currentBets[i].selecctionId;
			console.log('addorder_'+sid);
			app.io.broadcast('addorder_'+sid, currentBets[i]);				
		}
	});
} 

 
/**
* Return active markets list
* TODO: use undescore
*/
OrderObserver.prototype.getList = function() {
	sysLogger.debug('<OrderObserver> <getList> size = ' + listutils.count(theoreticals));
	var innerArray = [];
	for (property in theoreticals) {
	    innerArray.push(theoreticals[property]);
	}
	return innerArray;
}


/**
* Emits event with stale market and remove it from the list +
* if not-retrieved limit exceeded. 
*/
OrderObserver.prototype.remove = function(theoretical) {
	var self = this;
	app.io.broadcast('removebatch', theoreticals[theoretical.marketId]);	
	theoreticals[theoretical.marketId].remove(); 
}

/**
* Emits event with new market and adds it to the list.
*/ 
OrderObserver.prototype.add = function(theoretical) {
	var self = this;
	if(theoreticals[theoretical.marketId] == undefined) {
		theoreticals[theoretical.marketId] = theoretical;     
		app.io.broadcast('addbatch', theoreticals[theoretical.marketId]);
	}
}


module.exports = OrderObserver;

