// (C) 2012 Anton Zemlyanov
//
// Emulator allows test bots for "free" using real price data
//

var emulator = require('./emulator.js');
var EmulatorMarket = require('./emulator_market.js')
	, ejson = require('./emulator_json');

var log = emulator.log;

function Emulator() {
    var self = this;
    self.markets = {};
    self.customerRefs = {};
}


/**
*
*/
Emulator.prototype.getMarket = function(marketId, res, cb) {
	var self = this; 
	// check marketId
    var market = self.markets[marketId];
    if (!self.isMarketUsingBetEmulator(marketId) || !market) {
        var ex = {
            "errorDetails": "Market id passed is invalid. Probable cause: Emulator not enabled.",
            "errorCode": "INVALID_INPUT_DATA"
        };
        self.sendExceptionResponse(res, -32099, "ANGX-0002", ex);
        cb(null);
        return;
    }
    return market;
}

/**
* Check on return type
*/ 
Emulator.prototype.checkInstructions = function(req, marketId, res, cb) {
	var self = this;
    var instructions = req.params.instructions;
    if (!marketId || !instructions || instructions.length < 1) {
        sysLogger.critical('emulator_core> <checkInstructions> INST Length = ' +  instructions.length + ', MID = ' +  marketId);
   		self.sendErrorResponse(res, -32602, "Invalid Instructions");
        cb(null);
        return; 
    }
} 


// emulator control interface
Emulator.prototype.enableBetEmulatorForMarket = function (marketId) {
    var self = this;
    if (!self.markets[marketId]) {
        self.markets[marketId] = new EmulatorMarket(marketId);
        self.markets[marketId].emulator = self;
    }
    self.markets[marketId].isEmulated = true;
}

Emulator.prototype.disableBetEmulatorForMarket = function (marketId) {
    var self = this;
    if (self.markets[marketId]) {
        self.markets[marketId].isEmulated = false;
    }
}

Emulator.prototype.isMarketUsingBetEmulator = function (marketId) {
    var self = this;
    if (!self.markets[marketId])
        return false;
    return self.markets[marketId].isEmulated;
}

Emulator.prototype.onListMarketBook = function (result) {
    var self = this;

    if (!result)
        return false;

    for (var i = 0; i < result.length; ++i) {
        var marketItem = result[i];
        var marketId = marketItem.marketId;
        var isEmulated = self.isMarketUsingBetEmulator(marketId);
        if (!isEmulated) {
            log && log.info('Core: market "%s" is not emulated, skip it', marketId);
            continue;
        }
        var market = self.markets[marketId];
        market.onListMarketBook(marketItem);
    }
}

/**
* Process placeOrders API call
* @param req - request object
* @param res - response object
* @param cb - callback function: takes error as arg1 and res as arg2
*/
Emulator.prototype.placeOrders = function (req, res, cb) {
    var self = this;
	var marketId = req.params.marketId;

    self.checkInstructions(req, marketId, res, cb); 
    var market = self.getMarket(marketId, res, cb);
   
    setTimeout(function () {
    	sysLogger.debug("<emulator_core> <placeOrders> Delay = " +  self.bettingDelay);
    	market.placeOrders(req, res, function (err,marketres) {
        		cb(err,marketres);
    		}); 
    	}, self.bettingDelay);
   
}

/**
* Process listCurrentOrders API call
* @param req - request object
* @param res - response object
* @param cb - callback function: takes error as arg1 and res as arg2
*/
Emulator.prototype.listCurrentOrders = function (req, res, cb) {
    var self = this; 
    var res = {};
    var summaryReport = [];
    setTimeout(function () {
       	for(var i = 0; i< req.params.marketIds.length; i++) {
	    	var marketId = req.params.marketIds[i];
	    	sysLogger.debug('<emulator_core> <listCurrentOrders> MID = ' + marketId );
	    	if (!marketId) {
		        self.sendErrorResponse(res, -32602, "No such MID.");
		        cb(null);
		        return; 
	    	}
	    	var market = self.getMarket(marketId, res, cb);
	    	if(!market) {
	    		self.sendErrorResponse(res, -32602, "No Market defined for given ID " + marketId);
		        cb(null);
		        return; 
	    	}
	    	market.listCurrentOrders(req, res, function (err,meorders) {
        		if(meorders) {
        			for(var idx in meorders) {
        				summaryReport.push(meorders[idx]);
        			}
        		}
    		}); 
	    }
	    var result = {currentOrders: summaryReport, moreAvailable: false }
		res.response = ejson.prepareResponse(result);
		cb(null,res);
    }, self.bettingDelay);
}


/**
* Process updateOrders API call
*/
Emulator.prototype.updateOrders = function (req, res, cb) {
    var self = this;
	var marketId = req.params.marketId;

   self.checkInstructions(req, marketId, res, cb); 
   var market = self.getMarket(marketId, res, cb);
    
    // TODO REMOVE THIS 
	var ex = {
            "errorDetails": "Not implemented yet.",
            "errorCode": "INTERNAL ERROR"
     };
     self.sendExceptionResponse(res, -32099, "ANGX-0000", ex);
    
	setTimeout(function () {
    	sysLogger.debug("<emulator_core> <updateOrders> Delay = " +  self.bettingDelay);
    	market.updateOrders(req, res, function () {
        		cb(null);
    		}); 
    	}, self.bettingDelay);
}

/**
* Process cancelOrders API call
* @param req - request object
* @param res - response object
* @param cb - callback function: takes error as arg1 and res as arg2
*/
Emulator.prototype.cancelOrders = function (req, res, cb) {
    var self = this;
	var marketId = req.params.marketId;
	sysLogger.debug("<emulator_core> <cancelOrders> MID = " +  marketId);
    self.checkInstructions(req, marketId, res, cb); 
    var market = self.getMarket(marketId, res, cb);
       
	setTimeout(function () {
    	market.cancelOrders(req, res, function (err,marketres) {
        		cb(err,marketres);
    		}); 
    	}, self.bettingDelay);
}

// Unknown method
Emulator.prototype.unknownMethod = function (req, res, cb) {
    var self = this;

    self.sendErrorResponse(res, -32601, "Method not found");
    cb(null);
}

// Bad request
Emulator.prototype.badRequest = function (req, res, cb) {
    var self = this;

    self.sendErrorResponse(res, -32700, "Parse error");
    cb(null);
}

// Send valid JSON-RPC response
Emulator.prototype.sendResponse = function (res, result) {
    var self = this;

    //result.isEmulator = "true";
    res.result = result;
}

// Send JSON-RPC error
Emulator.prototype.sendErrorResponse = function (res, code, message) {
    var self = this;

    res.error = {
        code: code,
        message: message
    };
}

// Send JSON-RPC exception (error with "data" explaining problem)
Emulator.prototype.sendExceptionResponse = function (res, code, message, exception) {
    var self = this;

    exception.requestUUID = res.uuid;
    res.error = {
        code: code,
        message: message,
        data: {
            exceptionname: "APINGException",
            APINGException: exception
        }
    };
}




// Emulator is a singleton object
var emulator = module.exports = new Emulator();
