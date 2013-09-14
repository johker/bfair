// (C) 2012 Anton Zemlyanov
//
// Emulator allows test bots for "free" using real price data
//

var emulator = require('./emulator.js');
var exchange = require('./emulator_exchange');
var ec = require('./emulator_checks');


function EmulatorMarket(marketId) {
    var self = this;
    self.marketId = marketId;
    self.isInitialized = false;
    self.players = {};
}

EmulatorMarket.prototype.onListMarketBook = function (rec) {
    var self = this;
    var log = emulator.log;

    log && log.info("Market: onListMarketBook for marketId=" + rec.marketId);
    self.bookRecord = rec;

    var p1 = self.bookRecord.runners[0];
    var p2 = self.bookRecord.runners[1];
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
    // prepare error response
    var result = prepareResult(req, self.marketId);     
    var instructions = req.params.instructions;
    prepareReports(instructions, result);    	
	ec.checkInitialization(self, result, cb);	
	ec.checkInstructions(self, instructions, res, result, cb); 
	// ec.checkMarketStatus(self, res, result, cb);
	ec.checkNumberOfBets(self, req, res, cb)
	ec.checkBackLayCombination(self, instructions, cb);
		
    var dup = ec.isDuplicate(self, req);	
	// check input bets list
	var error;
	for ( var i = 0; i < instructions.length; ++i) {
		var desc = instructions[i];
		error = exchange.checkPlaceBetItem(self, desc);
	    sysLogger.info('<emulator_market> <placeOrders> error = ' + JSON.stringify(error, null, 2));
		if (error)
			break;
	}		
	
		

	//self.emulator.sendErrorResponse(req, res, -32602, "DSC-018");
	
    cb(null);
}

/**
* 
*/ 
function prepareResult(req, marketId) {
	return { 
		customerRef: req.params.customerRef, // optional
        status: "FAILURE",
        errorCode: "BET_ACTION_ERROR",
        marketId: marketId,
        instructionReports: []
    };
} 

/**
*
*/
function prepareReports(instructions, result) {
	for (var i = 0; i < instructions.length; ++i) {
        var inst = instructions[i];
        var rep = {
            status: "FAILURE",
            errorCode: "ERROR_IN_ORDER",
            instruction: inst
        };
        result.instructionReports.push(rep);
    }
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
