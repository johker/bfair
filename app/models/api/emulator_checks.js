/**
 * Externalized checks on emulator operations. 
 */ 
  
var betfairPrice = require('./betfair_price')
	, root = '../../../'
	, rtc = require(root + 'app/controllers/configcontroller')

var minimumBetSize = 2.0; // GBP
var maximumBetSize = 10000.0; //? GBP 
 
 
 /**
 * Constructor: Initialize with instructions to check against
 */
function EmulatorCheck(em, req, res, instructions, result) {
	
	
}

/**
* Enum with possible Faults
*/
EmulatorCheck.prototype.EmulatorCheckErrors = Object.freeze({
	"MarketNotInitialized":1, 
	"DuplicateCustomerRefs":2, 
	"InvalidNUmberOfBets":3,
	"InvalidBackLayCombination":4
});
 
 
 /**
 * Reply with error if market not yet initialized 	
 */
 EmulatorCheck.prototype.checkInitialization = function(market, cb) { 
 	var self = this; 
 	if (!market.isInitialized) {
    	sysLogger.info('<emulator_checks> <checkInitialization> Not initialized'); 
        cb({code: self.EmulatorCheckErrors.MarketNotInitialized, message: "Emulator for this Market not initialized." });
    } else {
 	   cb(null);
    }
 }
 
 /**
 * Reply with error if customer reference already exists.
 */
 EmulatorCheck.prototype.checkCustomerRefs = function(market, ref, cb) {
 	var self = this; 
    if(market.customerRefs[ref]) {
    	sysLogger.info('<emulator_checks> <checkInitialization> Not initialized'); 
        cb({code: self.EmulatorCheckErrors.DuplicateCustomerRefs, message: "Duplicate Customer Reference for this request." });
    } else {
    	market.customerRefs[ref] = true;
    	cb(null);
    }
 }
 
 /**
* Reply with error if number of bets are not between 1 and 60. 
*/
EmulatorCheck.prototype.checkNumberOfBets = function(instructions, cb) {
	var self = this; 
 	// BETWEEN_1_AND_60_BETS_REQUIRED - number of bets to be placed
    var betsCount = instructions.length;
    if (betsCount < 1 || betsCount > 60) {
    	sysLogger.info('<emulator_checks> <checkInitialization> Invalid number of bets.'); 
        cb({code: self.EmulatorCheckErrors.InvalidNUmberOfBets, message: "Invalid number of bets." });
    } else {
 	   cb(null);
    }  
 }
 
  /**
 * BACK_LAY_COMBINATION - invalid prices
 */
EmulatorCheck.prototype.checkBackLayCombination = function(instructions, cb) {
	var self = this; 
    var playerPrices = {};
    instructions.forEach(function(item) {
        if (!playerPrices[item.selectionId])
            playerPrices[item.selectionId] = {};
        var pl = playerPrices[item.selectionId];
        // Lay
        if (item.side === 'LAY' && (!pl.maxLayPrice || (1 * item.limitOrder.price) > (1 * pl.maxLayPrice)))
            pl.maxLayPrice = 1 * item.limitOrder.price;
        // Back
        if (item.side === 'BACK' && (!pl.minBackPrice || (1 * item.limitOrder.price) < (1 * pl.minBackPrice)))
            pl.minBackPrice = 1 * item.limitOrder.price;
    });
    sysLogger.debug("<emulator_checks> <checkBackLayCombination> playerPrices: " + JSON.stringify(playerPrices, null, 2));
    for ( var sId in playerPrices) {
        var pl = playerPrices[sId];
        if (1 * pl.minBackPrice <= 1 * pl.maxLayPrice) {
        	sysLogger.info('<emulator_checks> <checkInitialization> Invalid Back Lay Combination.'); 
        	cb({code: self.EmulatorCheckErrors.InvalidBackLayCombination, message: "Invalid Back Lay Combination." });
        }
    }
    cb(null); 
 
 }
 
  /**
 * Checks if there is a similar order whose lock has not expired yet.  
 * @param currentOrders - list of currentOrders to compare with
 * @return list of execution IDs that are locked 
 */
 EmulatorCheck.prototype.checkLockViolations = function(market, instructions, cb) {
 	var self = this;
 	for (var embet in market.bets) {
	    if (market.bets.hasOwnProperty(embet)) {
	    	if(market.bets[embet].selectionId != instructions[0].selectionId) {
	    		continue;
	    	}
	    	instructions.forEach(function(item) {
	    		sysLogger.debug('<emulator_checks> <checkLockViolations> New Bet with (cmp to: ' + market.bets[embet].betId + ', time diff: ' + (Math.abs(market.bets[embet].placedDate - (new Date()).getTime())) + ' => ' + (Math.abs(market.bets[embet].placedDate - (new Date()).getTime()) < 120000) +') = ' + item.limitOrder.price + ', ' + market.bets[embet].price + ' => ' + ( market.bets[embet].betType == item.side && (Math.abs(market.bets[embet].price - item.limitOrder.price) < 0.0001) && (Math.abs(market.bets[embet].placedDate - (new Date()).getTime()) < 120000)));
		       	if(market.bets[embet].betType == item.side
		       	 && (Math.abs(market.bets[embet].price - item.limitOrder.price) < 0.0001)
		       	 && (Math.abs(market.bets[embet].placedDate - (new Date()).getTime()) < 120000)) {
		       		sysLogger.debug('<emulator_checks> <checkLockViolations> VIOLATION - EXID = '+ item.executionId + ' Price '+ item.limitOrder.price + ' still locked by bet with ID = ' + market.bets[embet].betId); 
		            item['isLocked'] = true;
		       	}
		    });
	    }
	} 
	cb(null, instructions); 
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
 

 

 
 module.exports = EmulatorCheck;
   