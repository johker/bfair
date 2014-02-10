	
var root = '../../../../'
 	, rtc = require(root + 'app/controllers/configcontroller')
 	, BfError = require(root +  'errors/bfairerror')
	, servicedir = root + 'app/models/services/'
	, pricerequests = require(servicedir + 'prices/pricerequests')
	, orderrequests = require(servicedir + 'orders/orderrequests') 
 	, async = require('async')
	, exId = 0;
	

/**
* Executes orders based on a given theoretical fair price.
* @param thprice - RabbitMQ (theoretical) Price JSON DTO
* @param cb - callback function
*/
exports.executeTheoretical = function(thprice, cb) {	
	sysLogger.debug('<execution> <executeTheoretical> SID: ' + thprice.selectionId);
	/**
	* TODO: REMOVE THIS LINE 
	*/
	//if(thprice.selectionId != rtc.getConfig('api.lockedSelectionId')) return;
	
	var mid = thprice.marketId;
	var sid = thprice.selectionId; 
	var th = thprice.theoretical;
	app.io.broadcast('theoretical_'+ mid.substring(2,mid.length), {theoretical: thprice.theoretical, selectionId: thprice.selectionId});
	async.waterfall([
			function(cb) {cb(null, mid, sid);}, 
			getCurrentOrders,
			function(sidBets, cb) {cb(null, sidBets, th);}, // Pass th as additional parameter
			getBetIdsToCancel, 
			function(bidtc, cb) {cb(null, bidtc, mid);}, // Pass mid as additional parameter
			cancelDirtyOrders,
			function(cb) {cb(null, mid, sid);},
			getMarketBookForSid,
			function(book, cb) {cb(null, book, th);},
			getOrdersToCall, 
			function(ordersToCall, cb) {cb(null, ordersToCall, mid, sid);},
			callOrders			
		], function(err) {
			if(err) {
				cb(err);
		    } 	
		        	    
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
			'persistenceType': rtc.getConfig('api.defaultsettings.persistenceType') 
		};	
		var bi = {
			'selectionId': sid,
			'handicap': rtc.getConfig('api.defaultsettings.handicap'),
			'side': ordersToCall[i].side,
			'orderType': rtc.getConfig('api.defaultsettings.orderType'),
			'limitOrder': lo,
			'executionId': ordersToCall[i].executionId,
			'isLocked': false
		};
		sysLogger.debug('<execution> <callOrders> betInstruction = ' + JSON.stringify(bi));
		betInstructions.push(bi);
	}
	if(betInstructions.length == 0) {
		cb(new BfError(CODES.DEFERED_THEORETICAL, 'No Bet Instructions found.')); 
		return;
	}
	var params =  {'marketId':mid, 'instructions': betInstructions}
	orderrequests.placeOrders(params, function(err, res) {
		//if(err) cb(err);
		cb(null);
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
			 	ordersToCall.push({'side': 'BACK', 'price': avToBack[i].price, 'size': rtc.getConfig('api.execution.defaultOrderSize'), 'executionId': exId++});
			 	sysLogger.info('<execution> <getOrdersToCall> BACKING TH = ' + th + ', AVB. PRICE = ' + avToBack[i].price + ', EXID:' + exId);
			 }
		}
	}
	if(avToLay != null) {
		for(var i = avToLay.length-1; i >= 0 ; i--) {
			if(th > avToLay[i].price) {
			 	ordersToCall.push({'side': 'LAY', 'price': avToLay[i].price, 'size': rtc.getConfig('api.execution.defaultOrderSize'), 'executionId': exId++});
			 	sysLogger.info('<execution> <getOrdersToCall> LAYING TH = ' + th + ', AVL. PRICE = ' + avToLay[i].price + ', EXID:' + exId);
			 }
		}
	}
	cb(null, ordersToCall);  
 }

/**
* Returns the market book for its selection ID
* @param mid - marketId
* @param sid - selectionId
* @param cb - callback function
*/
function getMarketBookForSid(mid, sid, cb) {
	pricerequests.listMarketBook({marketIds: [mid], priceProjection: {priceData: ['EX_ALL_OFFERS']}}, function(err, res) {
		if(err) cb(err);
		if(!res.response.result || res.response.result.length == 0) {
			cb(new BfError(CODES.INTERNAL_ERROR, 'No result found for MID ' + mid));
			return;
		}
		var runners = res.response.result[0].runners;
		for(var i = 0; i < runners.length; i++ ){
			if(runners[i].selectionId == sid) {
				cb(null, runners[i]);
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
	var shortmid = mid.substring(2,mid.length);
	var instructions = [];
	var cancelinst = {}; 
	if(bidtc.length < 1) {
		sysLogger.debug('<execution> <cancelDirtyOrders> bidtc.length = ' + 0);
		cb(null);
		return;
	}
	for(var i = 0; i < bidtc.length; i++) {
		cancelinst['betId'] = bidtc[i].betId;
		cancelinst['sizeReduction'] = bidtc[i].sizeRemaining; 
		instructions.push(cancelinst); 
		app.io.broadcast('removeorder_'+shortmid, bidtc[i].betId);	// If only partially canceled it will be added again 			
	}
	sysLogger.debug('<execution> <cancelDirtyOrders> instructions = ' + JSON.stringify(instructions));
	orderrequests.cancelOrders({"marketId":mid,"instructions":instructions}, function(err, res) {
		cb(err);
	});	
}

/**
* Checks which placed orders violate theoretical and 
* returns a list of bets 
* @param sidBets - orders o the runner given by the selectionId
* @param th - theoretical price   
* @param cb - callback function
*/
function getBetIdsToCancel(sidBets, th, cb) {
	sysLogger.debug('<execution> <getBetIdsToCancel> sidBets = ' + JSON.stringify(sidBets));	 
	var betIdsToCancel = [];
	for(var i = 0; i < sidBets.length; i++) {
		if(sidBets[i].status == 'EXECUTION_COMPLETE') continue;
		sysLogger.debug('<execution> <getBetIdsToCancel> SIDE = ' + sidBets[i].side + ', PRICE = ' + sidBets[i].priceSize.price + ', TH = ' + th + ', RESULT = ' + (sidBets[i].side == 'BACK' && sidBets[i].priceSize.price < th
			|| sidBets[i].side == 'LAY' && sidBets[i].priceSize.price > th));
			if(sidBets[i].side == 'BACK' && sidBets[i].priceSize.price < th
			|| sidBets[i].side == 'LAY' && sidBets[i].priceSize.price > th) {
					betIdsToCancel.push(sidBets[i]);
			} 
	}
	cb(null, betIdsToCancel); 
}


/**
* Returns all orders of the runner given by the selectionId   
* @param sid - selection id of the runner
* @param th - theoretical price
* @param cb - callback function  
*/
function getCurrentOrders(mid, sid, cb) {
	orderrequests.listCurrentOrders({"marketIds":[mid], "placedDateRange":{}}, function(err, data) {
		var sidBets = []; 
		try {
			if(!data.response.result || data.response.result == {}) {
				cb(new BfError(CODES.DEFERED_THEORETICAL, 'Empty result set: No orders found'));
				return;
			}  
			var currentBets = data.response.result.currentOrders;
			sysLogger.debug('<execution> <getCurrentOrders> BETS LENGTH = ' + currentBets.length);
			for(var i = 0; i < currentBets.length; i++ ){
				if(currentBets[i].selectionId == sid) {
					sidBets.push(currentBets[i]);
				}
			}
		} catch(err) {
			cb(err);
		} 		
		cb(null, sidBets);
	});
}
