// (C) 2012 Anton Zemlyanov
//
// Emulator allows test bots for "free" using real price data
//

var emulator = require('./emulator.js')
	, exchange = require('./emulator_exchange')
	

var EmulatorBet = require('./emulator_bet.js')
	, EmulatorChecks = require('./emulator_checks')
	, ejson = require('./emulator_json');



function EmulatorMarket(marketId) {
    var self = this;
    self.marketId = marketId;
    self.isInitialized = false;
    self.players = {};
    self.bets = {};
    self.currentOrders = {}
}

EmulatorMarket.prototype.listCurrentOrders = function(req, res, cb) {
	var self = this;
	var summaryReport = [];
	for (var embet in self.bets) {
	    if (self.bets.hasOwnProperty(embet)) {
	       	summaryReport.push(self.bets[embet].getCurrentOrderSummary());
	       	sysLogger.crit('<emulator_market> <listCurrentOrders> = ' + self.bets[embet].getCurrentOrderSummary().priceSize.size); 
	    }
	}	
	cb(null, summaryReport);
}

EmulatorMarket.prototype.onListMarketBook = function (rec) {
    var self = this;
    var log = emulator.log;

    log && log.info("Market: onListMarketBook for marketId=" + rec.marketId);
    self.bookRecord = rec;
    
    // Set players
    for(var i = 0; i < self.bookRecord.runners.length; i++) {
    	var p = self.bookRecord.runners[i]; 
    	self.players[self.bookRecord.runners[i].selectionId] = p;
    }

    if (!self.isInitialized) {
        log && log.info("Market: market is initialized");
    }
    self.isInitialized = true;
}

// Process placeOrders API call
EmulatorMarket.prototype.placeOrders = function (req, res, cb) {
    var self = this;
    var log = emulator.log;    
    log && log.info("Market: placeOrders");
    
    var instructions = req.params.instructions;
    var result = ejson.prepareResult(ejson.SUCCESS, req, self.marketId);
	            	
    var ec = new EmulatorChecks(self, req, res, instructions, result);
             	
	ec.checkInitialization(cb);	
	ec.checkInstructions(cb); 
	// ec.checkMarketStatus(cb);
	ec.checkNumberOfBets(cb)
	ec.checkBackLayCombination(cb);	
    var dup = ec.isDuplicate();	
    
	var betIds = ejson.createBets(self, instructions); 
	
	var bets = betIds.map(function(id) {
		return self.bets[id];
	});	
	// Try to match bets using price matching
	exchange.matchBetsUsingPrices(self, bets, result);	
		 
	for(var i = 0; i < bets.length; i++) {
		ejson.addInstructionReport(ejson.SUCCESS, instructions[i], result, bets[i]) 
	}
	var res = {}; 
	res.response = ejson.prepareResponse(result);
	cb(null, res);
}


// Process updateOrders API call
EmulatorMarket.prototype.updateOrders = function (req, res, cb) {
    var self = this;
    var log = emulator.log;
	
	var instructions = req.params.instructions;	
    cb(null);
}

// Process cancelOrders API call
EmulatorMarket.prototype.cancelOrders = function (req, res, cb) {
    var self = this;
    var log = emulator.log;
	 
	var instructions = req.params.instructions;
	var betIds = [];
	
	for(var i = 0; i < instructions.length; i++) {
		var embet = self.bets[instructions[i].betId];
		if(embet) {
			embet.cancel(instructions[i].sizeReduction);
		}
	}
	var bets = betIds.map(function(id) {
		return self.bets[id];
	});	
	
    cb(null);
}


// Emulator is a singleton object
module.exports = EmulatorMarket;
