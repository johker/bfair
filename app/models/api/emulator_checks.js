/**
 * Externalized checks on emulator operations. 
 */ 
  
var betfairPrice = require('./betfair_price');

var minimumBetSize = 2.0; // GBP
var maximumBetSize = 10000.0; //? GBP 
 
 /**
 *
 */
 exports.checkInitialization = function(em, result, cb) { 
 	// reply with error if market not yet initialized 	
    if (!em.isInitialized) {
    	sysLogger.info('<emulator_checks> <checkInitialization> Not initialized'); 
        em.emulator.sendResponse(res, result);
        cb(null);
        return;
    }
 
 }
 
 /**
 * Duplicate customer refs.
 */
 exports.isDuplicate = function(em, req) {
 	var ref = req.params.customerRef;
    if (!ref)
        return;
    var isDup = self.customerRefs[ref] ? true : false;
    em.customerRefs[ref] = true;
    return isDup;
 
 }
 
 /** 
 * Check bet instructions
 */
 exports.checkInstructions = function(em, instructions, res, result, cb) { 	
    for (var i = 0; i < instructions.length; ++i) {
        var inst = instructions[i];
        // check order
        if (!inst.orderType || inst.orderType !== 'LIMIT') {
        	sysLogger.info('<emulator_checks> <checkInstructions> Invalid Order Type'); 
            em.emulator.sendErrorResponse(res, -32602, "DSC-018");
            cb(null);
            return;
        }
        var error; 
        
		error = checkPlaceBetItem(em, inst);	  
		if (error) {
        	sysLogger.info('<emulator_checks> <checkInstructions> Invalid Bet Item'); 
            result.status = "INVALID_BET_ITEM";
            em.emulator.sendResponse(res, result);
            cb(null);
            return;
        }
        // check selectionId
        var selId = inst.selectionId;
        var player = em.players[selId];
        if (!player) {
        	sysLogger.info('<emulator_checks> <checkInstructions> Invalid Runner'); 
            result.status = "INVALID_RUNNER";
            em.emulator.sendResponse(res, result);
            cb(null);
            return;
        }
    }
 
 } 
 
 /**
* Check a single bet item from placeBets bets list
*/
function checkPlaceBetItem(em, desc) {

    if (!desc.limitOrder ||
    	( desc.limitOrder.persistenceType !== 'LAPSE' 
    	&& desc.limitOrder.persistenceType !== 'PERSIST'
    	&& desc.limitOrder.persistenceType !== 'MARKET_ON_CLOSE')) {
    	sysLogger.info('<emulator_checks> <checkPlaceBetItem> INVALID_PERSISTENCE');
        return 'INVALID_PERSISTENCE';
    }

    if (desc.side !== 'BACK' && desc.side !== 'LAY') {
    	sysLogger.info('<emulator_checks> <checkPlaceBetItem> INVALID_BET_TYPE');
        return 'INVALID_BET_TYPE';
    }

    var price = betfairPrice.newBetfairPrice(desc.price);
    if (Math.abs(price.size - 1 * desc.price) > 0.0001) {
    	sysLogger.info('<emulator_checks> <checkPlaceBetItem> INVALID_PRICE');
        return 'INVALID_PRICE';
    }

    if (!em.players[desc.selectionId]) {
    	sysLogger.info('<emulator_checks> <checkPlaceBetItem> SELECTION_REMOVED');
        return 'SELECTION_REMOVED';
	}

    if (1 * desc.size < minimumBetSize || 1 * desc.size > maximumBetSize) {
    	sysLogger.info('<emulator_checks> <checkPlaceBetItem> INVALID_SIZE');
        return 'INVALID_SIZE';
	}
    // no checks failed, then bet is OK
    return null;
}
 
/**
* Check a single bet item from updateBets bets list
*/
function checkUpdateBetItem(em, desc) {
    throw new Error('Not yet implemented');
}

/**
* Check a single bet item from cancelBets bets list
*/
function checkCancelBetItem (em, desc) {
    // check betId is mine
    if (!em.bets[desc.betId]) {
        // MARKET_IDS_DONT_MATCH - Bet ID does not exist
        return 'MARKET_IDS_DONT_MATCH';
    }
    return null;
}
 
 
 
 
 exports.checkMarketStatus = function(em, res, result, cb) {
	 // handle market status, only 'ACTIVE' allows placing bets
	    if (em.marketStatus === 'SUSPENDED') {
	    	sysLogger.info('<emulator_checks> <checkMarketStatus> Invalid Market Staus: EVENT_SUSPENDED'); 
            result.status = "EVENT_SUSPENDED";
            result.errorCode = 'MARKET_STATUS_INVALID';
            em.emulator.sendResponse(res, result);
            cb(null);
            return;
	    } else if (em.marketStatus === 'CLOSED') {
	    	sysLogger.info('<emulator_checks> <checkMarketStatus> Invalid Market Staus: EVENT_CLOSED'); 
            result.status = "EVENT_CLOSED";
            result.errorCode = 'MARKET_STATUS_INVALID';
            em.emulator.sendResponse(res, result);
            cb(null);
            return;
	    } else if (em.marketStatus !== 'ACTIVE') {
	    	sysLogger.info('<emulator_checks> <checkMarketStatus> Invalid Market Staus: EVENT_INACTIVE'); 
            result.status = "EVENT_INACTIVE";
            result.errorCode = 'MARKET_STATUS_INVALID';
            em.emulator.sendResponse(res, result);
            cb(null);
	        return;
	    } 
 }
 
 exports.checkNumberOfBets = function(em, instructions, res, cb) {
 	if(!instructions) 
 		return;
 	 // BETWEEN_1_AND_60_BETS_REQUIRED - number of bets to be placed
    var betsCount = instructions.length;
    if (betsCount < 1 || betsCount > 60) {
    	sysLogger.info('<emulator_checks> <checkNumberOfBets> Invalid Number Of Bets: BETWEEN_1_AND_60_BETS_REQUIRED'); 
        result.errorCode = 'BETWEEN_1_AND_60_BETS_REQUIRED';        
        result.status = "FAILURE";
        em.emulator.sendResponse(res, result);
        cb(null);
        return
    }  
 }
 
 /**
 * BACK_LAY_COMBINATION - invalid prices
 */
 exports.checkBackLayCombination = function(em, instructions, res, cb) {
    var playerPrices = {};
    instructions.forEach(function(item) {
        if (!playerPrices[item.selectionId])
            playerPrices[item.selectionId] = {};
        var pl = playerPrices[item.selectionId];
        //pl['maxLayPrice'] = 0;
        //pl['minBackPrice'] = 0;  
        // Lay
        if (item.side === 'LAY'
                && (!pl.maxLayPrice || (1 * item.limitOrder.price) > (1 * pl.maxLayPrice)))
            pl.maxLayPrice = 1 * item.limitOrder.price;
        // Back
        if (item.side === 'BACK'
                && (!pl.minBackPrice || (1 * item.limitOrder.price) < (1 * pl.minBackPrice)))
            pl.minBackPrice = 1 * item.limitOrder.price;
    });
    sysLogger.debug("<emulator_checks> <checkBackLayCombination> playerPrices: " + JSON.stringify(playerPrices, null, 2));
    for ( var sId in playerPrices) {
        var pl = playerPrices[sId];
        if (1 * pl.minBackPrice <= 1 * pl.maxLayPrice) {
        	sysLogger.info('<emulator_checks> <checkBackLayCombination> minBackPrice > maxLayPrice: BACK_LAY_COMBINATION'); 
            result.errorCode = 'BACK_LAY_COMBINATION';        
        	result.status = "FAILURE";
        	em.emulator.sendResponse(res, result);
        	cb(null);
        	return;
        }
    }
 
 }
   