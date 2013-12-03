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
}

EmulatorMarket.prototype.onListMarketBook = function (rec) {
    var self = this;
    var log = emulator.log;

    log && log.info("Market: onListMarketBook for marketId=" + rec.marketId);
    self.bookRecord = rec;

    var p1 = self.bookRecord.runners[0];
    var p2 = self.bookRecord.runners[1];
    
    //p1.bestBack
    
    self.players[p1.selectionId] = p1;
    self.players[p2.selectionId] = p2;

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
	// Try to match bets using price matching
	var bets = betIds.map(function(id) {
		return self.bets[id];
	});	
	
	exchange.matchBetsUsingPrices(self, bets, result);	
		 
	for(var i = 0; i < bets.length; i++) {
		ejson.addInstructionReport(ejson.SUCCESS, instructions[i], result, bets[i]) 
	}
	var res = {}; 
	res.response = ejson.prepareResponse(result);
	cb(null, res);
}



// Process replaceOrders API call
EmulatorMarket.prototype.replaceOrders = function (req, res, cb) {
    var self = this;
    var log = emulator.log;

    // check marketId
    var marketId = req.params.marketId;
    if (!self.isMarketUsingBetEmulator(marketId)) {
        var ex = {
            "errorDetails": "market id passed is invalid",
            "errorCode": "INVALID_INPUT_DATA"
        };
        sendExceptionResponse(req, res, -32099, "ANGX-0002", ex);
        cb(null);
        return;
    }

    // is duplicate
    var dup = isDuplicate(self, req);

    sendErrorResponse(req, res, -32602, "DSC-018");
    cb(null);
}

// Process updateOrders API call
EmulatorMarket.prototype.updateOrders = function (req, res, cb) {
    var self = this;
    var log = emulator.log;

    // check marketId
    var marketId = req.params.marketId;
    if (!self.isMarketUsingBetEmulator(marketId)) {
        var ex = {
            "errorDetails": "market id passed is invalid",
            "errorCode": "INVALID_INPUT_DATA"
        };
        sendExceptionResponse(req, res, -32099, "ANGX-0002", ex);
        cb(null);
        return;
    }

    // is duplicate
    var dup = isDuplicate(self, req);

    sendErrorResponse(req, res, -32602, "DSC-018");
    cb(null);
}

// Process cancelOrders API call
EmulatorMarket.prototype.cancelOrders = function (req, res, cb) {
    var self = this;
    var log = emulator.log;

    // check marketId
    var marketId = req.params.marketId;
    if (!self.isMarketUsingBetEmulator(marketId)) {
        var ex = {
            "errorDetails": "market id passed is invalid",
            "errorCode": "INVALID_INPUT_DATA"
        };
        sendExceptionResponse(req, res, -32099, "ANGX-0002", ex);
        cb(null);
        return;
    }

    // is duplicate
    var dup = checks.isDuplicate(self, req);

    sendErrorResponse(req, res, -32602, "DSC-018");
    cb(null);
}


// Emulator is a singleton object
module.exports = EmulatorMarket;
