	
var env = process.env.NODE_ENV || 'development'
 	, root = '../../../../'
 	, config = require(root + 'config/config')[env]
	, servicedir = root + 'app/models/services/'
	, pricerequests = require(servicedir + 'prices/pricerequests')
	, orderrequests = require(servicedir + 'orders/orderrequests') 
	
	

/**
* Executes orders based on a given theoretical fair price.
* @param thprice - RabbitMQ (theoretical) Price JSON DTO
* @param cb - callback function
*/
exports.executeTheoretical = function(thprice, cb) {	
	sysLogger.crit('<execution> <executeTheoretical> SID: ' + thprice.selectionId);
	
	
	/**
	* TODO: REMOVE THIS LINE 
	*/
	if(thprice.selectionId != config.api.testSelectionId) return;
	var mid = thprice.marketId;
	var sid = thprice.selectionId; 
	var th = thprice.theoretical;
	 getCurrentOrders(mid, sid, function(sidBets) {
		var bidtc = getBetIdsToCancel(sidBets, th); 
		cancelDirtyOrders(bidtc, mid, function(err, res) {
			getMarketBookForSid(mid, sid, function(book) {
				getOrdersToCall(book, sid, function(ordersToCall) {
					callOrders(ordersToCall, mid, sid, function(err, res) {
						cb(err,res);
					});
				});
			});
		});	
	});
}

/**
* Transforms collected orders into bet instructions and places 
* orders accordingly.
* @param ordersToCall - collected orders
* @param th - theoretical price
* @param mid - marketId
* @param sid - selectionId
* @param cb - callback function
*/
function callOrders(ordersToCall, mid, sid, cb) {
	var betInstructions = [];
	for(var i = 0; i<ordersToCall.length; i++) {
		var lo = {
			'size':ordersToCall[i].size,
			'price':ordersToCall[i].price, 
			'persistenceType':config.api.defaultsettings.persistenceType 
		};	
		var bi = {
			'selectionId': sid,
			'handicap':config.api.defaultsettings.handicap,
			'side': ordersToCall[i].side,
			'orderType': config.api.defaultsettings.orderType,
			'limitOrder': lo
		};
		betInstructions.push(bi);
	}
	var params =  {'marketId':mid, 'instructions': betInstructions}
	orderrequests.placeOrders(params, function(err, res) {
		cb(err, res);
	});
}

/**
* Collects orders that are inconsistent with calculated theoretical price 
* and returns a list of instructions where order types are mirrored.
* @param book - order book of selected runner
* @param th - theoretical price
* @param cb - callback function  
*/
function getOrdersToCall(book, th, cb) {
	var avToBack = book.ex.availableToBack;
	var avToLay = book.ex.availableToLay;
	ordersToCall = [];
	if(avToBack != null) {
		for(var i = avToBack.length-1; i >= 0 ; i--) {
			if(th < avToBack[i].price) {
			 	ordersToCall.push({'side': 'LAY', 'price': avToBack[i].price, 'size': avToBack[i].size});
			 }
		}
	}
	if(avToLay != null) {
		for(var i = avToLay.length-1; i >= 0 ; i--) {
			if(th > avToLay[i].price) {
			 	ordersToCall.push({'side': 'BACK', 'price': avToLay[i].price, 'size': avToLay[i].size});
			 }
		}
	}
	cb(ordersToCall);  
 }

/**
* Returns the market book for its selection ID
* @param mid - marketId
* @param sid - selectionId
* @param cb - callback function
*/
function getMarketBookForSid(mid, sid, cb) {
	pricerequests.listMarketBook({marketIds: [mid], priceProjection: {priceData: ['EX_ALL_OFFERS']}}, function(err, res) {
		var runners = res.response.result[0].runners;
		for(var i = 0; i < runners.length; i++ ){
			if(runners[i].selectionId == sid) {
				cb(runners[i]);
			}
		}
	});
}

/**
* Cancels orders based on passed list of bets.
* @param bidtc - list of bets to cancel
* @param mid - marketId
* @param cb - callback function  
*/
function cancelDirtyOrders(bidtc, mid, cb) {
	sysLogger.crit('<execution> <cancelDirtyOrders>');
	var instructions = [];
	var cancelinst = {}; 
	for(var i = 0; i < bidtc.length; i++) {
		cancelinst['betId'] = bidtc[i].betId;
		cancelinst['sizeReduction'] = bidtc[i].sizeRemaining; 
		instructions.push(cancelinst)
	}
	orderrequests.cancelOrders({"marketId":mid,"instructions":instructions}, function(err, res) {
			cb(err, res);
	});	
}

/**
* Checks which placed orders violate theoretical and 
* returns a list of bets 
* @param sidBets - orders o the runner given by the selectionId
* @param th - theoretical price   
*/
function getBetIdsToCancel(sidBets, th) {
	sysLogger.crit('<execution> <getBetIdsToCancel>');
	 var betIdsToCancel = [];
	for(var i = 0; i < sidBets; i++) {
			if(sidBets[i].side == 'BACK' && sidBets[i].priceSize.price < th
			|| sideBets[i].side == 'LAY' && sidBets[i].priceSize.price > th) {
					betIdsToCancel.push(sidBets[i]);
			} 
	}
	return betIdsToCancel; 
}


/**
* Returns all orders of the runner given by the selectionId   
* @param sid - selection id of the runner
* @param th - theoretical price
* @param cb - callback function  
*/
function getCurrentOrders(mid, sid, cb) {
	orderrequests.listCurrentOrders({"marketIds":[mid], "placedDateRange":{}}, function(err, data) {
		var currentBets = data.response.result.currentOrders;
		var sidBets = []; 
		for(var i = 0; i < currentBets.length; i++ ){
			if(currentBets[i].selectionId == sid) {
				sidBets.push(currentBets[i]);
			}
		}
		cb(currentBets);
	});
}
