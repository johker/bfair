// (C) 2013 Anton Zemlyanov
// Patched by johker


// (C) 2012 Anton Zemlyanov
//
// Emulator allows test bots for "free" using real price data
// 
// The emulator service emulates HTTP behavior
// it gets "HTTP" SOAP requests and sends "HTTP" SOAP responses

var util = require('util');
var betfairPrice = require('./betfair_price')

// All the bets getIds
var lastBetId = 10000000000;

function EmulatorBet(markId, selId, type, price, size) {
    var self = this;
	sysLogger.crit('<emulator_bet> New Bet size = ' + size); 
    if (type !== 'BACK' && type !== 'LAY')
        throw new Error('Bet type should be BACK or LAY');

    var roundedPrice = betfairPrice.newBetfairPrice(1 * price);
    if (Math.abs(price - roundedPrice) > 0.000001)
        throw new Error('Bad price');

    // mandatory fields
    self.betId = ++lastBetId + ''; // force string
    self.marketId = markId;
    self.selectionId = selId
    self.betType = type;
    self.price = 1 * price;
    self.size = 1 * size; // unmatched size
    self.placedDate = new Date();

    // default suggestions
    self.asianLineId = "0";
    self.betCategoryType = "E";
    self.betPersistenceType = "NONE";
    self.bspLiability = "0";

    // matched portions
    self.matchedParts = [];
}

EmulatorBet.prototype.isMatched = function() {
    var self = this;
    return self.size < 0.001 && self.matchedParts.length > 0;
}

/**
* Mapping of EmulatorBet to Betfair Order Summary
* @return CurrentOrderSummary - Summary of a current order.
*/ 
EmulatorBet.prototype.getCurrentOrderSummary = function() {
	var self = this;
	return { betId: self.betId,
    marketId: self.marketId,
    selectionId: self.selectionId,
    handicap: 0,
    priceSize: { price: self.price, size: self.size },
    bspLiability: 0,
    side: self.betType,
    status: self.isMatched() ? 'EXECUTION_COMPLETE' : 'EXECUTABLE',
    persistenceType: 'LAPSE',
    orderType: 'LIMIT',
    placedDate: self.placedDate,
    averagePriceMatched: self.averageMatchedPrice(),
    sizeMatched: self.matchedSize(),
    sizeRemaining: self.unmatchedSize(),
    sizeLapsed: -1,	// TODO: calculate values
    sizeCancelled: -1,
    sizeVoided: -1,
    regulatorCode: 'GIBRALTAR REGULATOR' }
}



EmulatorBet.prototype.averageMatchedPrice = function() {
    var self = this;
	
    // weighted sum of prices of matched parts
    var matchedSize = self.matchedSize();
    var averagePrice = 0;
    self.matchedParts.forEach(function(item) {
        averagePrice += item.price * (item.size / matchedSize);
    });
    sysLogger.crit('<emulator_bet> <averageMatchedPrice> New Bet size = ' + self.size); 
    return averagePrice;
}

EmulatorBet.prototype.matchedSize = function() {
    var self = this;

    // sum of all matched portions
    var sum = 0;
    self.matchedParts.forEach(function(item) {
        sum += 1 * item.size;
    });
    sysLogger.crit('<emulator_bet> <matchedSize> New Bet size = ' + self.size); 
    return sum;
}

EmulatorBet.prototype.unmatchedSize = function() {
    var self = this;
    // just size
    return self.size;
}

// match all the remaining size
// for backs, price>=bet.Price
// for lays, price<=betPrice
EmulatorBet.prototype.matchWhole = function(price) {
    var self = this;
    return self.matchPortion(price, self.size);
}

// match protion
// for backs, price>=bet.Price
// for lays, price<=betPrice
EmulatorBet.prototype.matchPortion = function(price, size) {
    var self = this;
    if (1 * size > 1 * self.size)
        return false;
    if (self.betType == 'L' && 1 * price > 1 * self.price)
        return false;
    if (self.betType == 'B' && 1 * price < 1 * self.price)
        return false;

    self.size -= 1 * size;
    self.matchedParts.push({
        matchedDate : new Date(),
        price : price,
        size : size
    });
    sysLogger.crit('<emulator_bet> <matchPortion> New Bet size = ' + self.size); 
    return true;
}

// cancelBets, just cancel unmatched portion
EmulatorBet.prototype.cancel = function(sizereduction) {
    var self = this;
	var sizeCancelled;
	if(sizereduction != null && sizereduction < self.unmatchedSize()) {
	 	self.reduceSize(sizereduction);
	 	sizeCancelled = sizereduction;
	 	var desc = {
	        code : 'SIZE_REDUCED',
	        sizeCancelled : sizeCancelled,
	        sizeMatched : self.matchedSize(),
	        success : 'true'
    	};
    	self.cancelled = false;
	 } else {
	 	self.reduceSize(self.unmatchedSize());
	 	sizeCancelled = self.unmatchedSize();
	 	var desc = {
	        code : 'REMAINING_CANCELLED',
	        sizeCancelled : sizeCancelled,
	        sizeMatched : self.matchedSize(),
	        success : 'true'
    	};
    	self.cancelled = true;
	}
	sysLogger.crit('<emulator_bet> <cancel> New Bet size = ' + self.size); 
   	return desc;
}

// updateBets, reduce bet size
EmulatorBet.prototype.reduceSize = function(sizereduction) {
    var self = this;
    // self.size is the unmatched portion size
    if(sizereduction > self.size) {
    	throw new Error('Invalid Bet size reduction.'); 
    }   
    self.size = self.size - sizereduction;
    sysLogger.crit('<emulator_bet> <reduceSize> New Bet size = ' + self.size); 
   
}

// updateBets, change persistence type
EmulatorBet.prototype.changePersistence = function(size) {
    var self = this;
}

module.exports = EmulatorBet;
