/**
 * Externalized checks on emulator operations. 
 */ 
  
var betfairPrice = require('./betfair_price');

var minimumBetSize = 2.0; // GBP
var maximumBetSize = 10000.0; //? GBP 
 
function EmulatorCheck(em, req, res, instructions, result) {
	var self = this; 
	
	self.market = em; 
	self.instructions = instructions; 
	self.request = req;
	self.response = res;
	self.result = result;
	
}
 
 
 /**
 *
 */
 EmulatorCheck.prototype.checkInitialization = function(cb) { 
 	var self = this; 
 	// reply with error if market not yet initialized 	
    if (!self.market.isInitialized) {
    	sysLogger.info('<emulator_checks> <checkInitialization> Not initialized'); 
        self.market.emulator.sendResponse(self.response, self.result);
        cb(null);
        return;
    }
 
 }
 
 /**
 * Duplicate customer refs.
 */
 EmulatorCheck.prototype.isDuplicate = function() {
 	var self = this; 
 	var ref = self.request.params.customerRef;
    if (!ref)
        return;
    var isDup = self.market.customerRefs[ref] ? true : false;
    self.market.customerRefs[ref] = true;
    return isDup;
 
 }
 
 /** 
 * Check bet instructions
 */
 EmulatorCheck.prototype.checkInstructions = function(cb) { 	
 	var self = this; 
    for (var i = 0; i < self.instructions.length; ++i) {
        var inst = self.instructions[i];
        // check order
        if (!inst.orderType || inst.orderType !== 'LIMIT') {
        	sysLogger.info('<emulator_checks> <checkInstructions> Invalid Order Type'); 
            self.market.emulator.sendErrorResponse(self.response, -32602, "DSC-018");
            cb(null);
            return;
        }
        var error; 
        error = self.checkPlaceBetItem(inst);	  
		if (error) {
        	sysLogger.info('<emulator_checks> <checkInstructions> Invalid Bet Item'); 
            self.result.status = "INVALID_BET_ITEM";
            self.result.errorCode = error;
            self.market.emulator.sendResponse(self.response, self.result);
            cb(null);
            return;
        }
        // check selectionId
        var selId = inst.selectionId;
        var player = self.market.players[selId];
        if (!player) {
        	sysLogger.info('<emulator_checks> <checkInstructions> Invalid Runner'); 
            self.result.status = "INVALID_RUNNER";
            self.market.emulator.sendResponse(self.response, self.result);
            cb(null);
            return;
        }
    }
 
 } 
 
 /**
* Check a single bet item from placeBets bets list
*/
EmulatorCheck.prototype.checkPlaceBetItem = function(desc) {
	var self = this; 
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

    if (!self.market.players[desc.selectionId]) {
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
EmulatorCheck.prototype.checkUpdateBetItem = function(desc) {
	var self = this; 
    throw new Error('Not yet implemented');
}

/**
* Check a single bet item from cancelBets bets list
*/
EmulatorCheck.prototype.checkCancelBetItem = function(desc) {
	var self = this; 
    throw new Error('Not yet implemented');
 
 }
 
EmulatorCheck.prototype.checkMarketStatus = function(cb) {
	var self = this; 
	 // handle market status, only 'ACTIVE' allows placing bets
	    if (self.market.marketStatus === 'SUSPENDED') {
	    	sysLogger.info('<emulator_checks> <checkMarketStatus> Invalid Market Staus: EVENT_SUSPENDED'); 
            self.result.status = "EVENT_SUSPENDED";
            self.result.errorCode = 'MARKET_STATUS_INVALID';
            self.market.emulator.sendResponse(self.response, self.result);
            cb(null);
            return;
	    } else if (self.market.marketStatus === 'CLOSED') {
	    	sysLogger.info('<emulator_checks> <checkMarketStatus> Invalid Market Staus: EVENT_CLOSED'); 
            self.result.status = "EVENT_CLOSED";
            self.result.errorCode = 'MARKET_STATUS_INVALID';
            self.market.emulator.sendResponse(self.response, self.result);
            cb(null);
            return;
	    } else if (self.market.marketStatus !== 'ACTIVE') {
	    	sysLogger.info('<emulator_checks> <checkMarketStatus> Invalid Market Staus: EVENT_INACTIVE'); 
            self.result.status = "EVENT_INACTIVE";
            self.result.errorCode = 'MARKET_STATUS_INVALID';
            self.market.emulator.sendResponse(self.response, self.result);
            cb(null);
	        return;
	    } 
 }
 
EmulatorCheck.prototype.checkNumberOfBets = function(cb) {
	var self = this; 
 	if(!self.instructions) 
 		return;
 	 // BETWEEN_1_AND_60_BETS_REQUIRED - number of bets to be placed
    var betsCount = self.instructions.length;
    if (betsCount < 1 || betsCount > 60) {
    	sysLogger.info('<emulator_checks> <checkNumberOfBets> Invalid Number Of Bets: BETWEEN_1_AND_60_BETS_REQUIRED'); 
        self.result.errorCode = 'BETWEEN_1_AND_60_BETS_REQUIRED';        
        self.result.status = "FAILURE";
        self.market.emulator.sendResponse(self.response, self.result);
        cb(null);
        return
    }  
 }
 
 /**
 * BACK_LAY_COMBINATION - invalid prices
 */
EmulatorCheck.prototype.checkBackLayCombination = function(cb) {
	var self = this; 
    var playerPrices = {};
    self.instructions.forEach(function(item) {
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
            self.result.errorCode = 'BACK_LAY_COMBINATION';        
        	self.result.status = "ERROR";
        	self.market.emulator.sendResponse(self.response, self.result);
        	cb(null);
        	return;
        }
    }
 
 }
 
 module.exports = EmulatorCheck;
   