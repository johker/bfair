// (C) 2012 Anton Zemlyanov
//
// Emulator allows test bots for "free" using real price data
//

var async = require('async')
	, emulator = require('./emulator.js')
	, exchange = require('./emulator_exchange')
	, EmulatorBet = require('./emulator_bet.js')
	, EmulatorChecks = require('./emulator_checks')
	, ejson = require('./emulator_json');


/**
* Market Constructor
*/
function EmulatorMarket(marketId) {
    var self = this;
    self.marketId = marketId;
    self.isInitialized = false;
    self.players = {};
    self.bets = {};
    self.customerRefs = {};
}

/**
* Process of listCurrentOrders API call - diyplays emulator bets 
" exclusively
*/
EmulatorMarket.prototype.listCurrentOrders = function(req, res, cb) {
	var self = this;
	var summaryReport = [];
	for (var embet in self.bets) {
	    if (self.bets.hasOwnProperty(embet)) {
	       	summaryReport.push(self.bets[embet].getCurrentOrderSummary());
	    }
	}	
	cb(null, summaryReport);
}

/**
* Update of book record? 
*/
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

/**
* Process placeOrders API call
*/
EmulatorMarket.prototype.placeOrders = function (req, res, cb) {
    var self = this;
    var log = emulator.log;    
    log && log.info("Market: placeOrders"); 
       
    var instructions = req.params.instructions;
    var customerRef = req.params.customerRef;
    var result = ejson.prepareResult(ejson.SUCCESS, req, self.marketId);	            	
    var ec = new EmulatorChecks();
             	
    async.parallel([
        function(callback) {
            ec.checkInitialization(self, function(err) {
                if (err) return callback(err);
                sysLogger.debug('<placeOrders> checkInitialization: PASSED');
                callback();
            });
        },
        function(callback) {
            ec.checkCustomerRefs(self, customerRef, function(err) {
                if (err) return callback(err);
                sysLogger.debug('<emulator_market> <placeOrders> checkCustomerRefs: PASSED');
                callback();
            });
        },
        function(callback) {
            ec.checkNumberOfBets(instructions, function(err) {
                if (err) return callback(err);
                sysLogger.debug('<emulator_market> <placeOrders> checkLockViolations: PASSED');
                callback();
            });
        },
        function(callback) {
            ec.checkBackLayCombination(instructions, function(err) {
                if (err) return callback(err);
                sysLogger.debug('<emulator_market> <placeOrders> checkBackLayCombination: PASSED');
                callback();
            });
        },
        function(callback) {
            ec.checkLockViolations(self, instructions, function(err, updatedinstructions) {
            	self.instructions = updatedinstructions; 
                if (err) return callback(err);                
                callback(updatedinstructions);
            });
        }
    ], function(err) { //This function gets called after all tasks have called their "task callbacks"
        if (err) { //If an error occured, we let express/connect handle it by calling the "next" function
        	cb(err);
        } 
        sysLogger.debug('<emulator_market> <placeOrders> checkBackLayCombination: Updated Instructions ' + JSON.stringify(instructions));
                
        var betIds = ejson.createBets(self, self.instructions); 
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
        
    });
    
    
}

/**
* Process updateOrders API call
* NOT YET IMPLEMENTED
*/
EmulatorMarket.prototype.updateOrders = function (req, res, cb) {
    var self = this;
	var instructions = req.params.instructions;	
    cb(null);
}

/**
* Process cancelOrders API call
*/
EmulatorMarket.prototype.cancelOrders = function (req, res, cb) {
    var self = this;
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
