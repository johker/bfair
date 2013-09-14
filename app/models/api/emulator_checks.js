/**
 * Externalized checks on emulator operations. 
 */ 
  
 
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
        if (!inst.orderType || inst.orderType !== 'LIMIT_ORDER') {
        	sysLogger.info('<emulator_checks> <checkInstructions> Invalid Order Type'); 
            em.emulator.sendErrorResponse(res, -32602, "DSC-018");
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
   