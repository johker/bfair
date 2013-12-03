/**
 * New node file
 */
var EmulatorBet = require('./emulator_bet.js');

exports.ERROR = 0;
exports.SUCCESS = 1;
 
 
exports.prepareResponse = function(result) {
	return {
		jsonrpc: "2.0",
		id: "2", 
		result: result
	};
}
 
exports.prepareResult = function(status, req, marketId) {
	switch(status) {
		case exports.ERROR: 
			return { 		
				customerRef: req.params.customerRef, // optional
		        status: "FAILURE",
		        errorCode: "BET_ACTION_ERROR",
		        marketId: marketId,
		        instructionReports: []
		    };
    	case exports.SUCCESS: 
			return {
				customerRef: req.params.customerRef, // optional
				status: "SUCCESS",
		      	marketId: marketId,
		        instructionReports: []
		    };
    } 
}

exports.addInstructionReport = function(status, instruction, result, bet) {
	var rep = {};
	switch(status) {
		case exports.ERROR:
			rep = {
	            status: "FAILURE",
	            errorCode: "ERROR_IN_ORDER",
	            instruction: instruction
	        };
	    case exports.SUCCESS:
			rep = {
	            status: "SUCCESS",
	            instruction: instruction,
	            betId: bet.betId,
	            placedDate: bet.placedDate,
	          	averagePriceMatched: bet.averageMatchedPrice(),
	          	sizeMatched: bet.matchedSize()
	        };        
    	}
    result.instructionReports.push(rep);
}

exports.createBets = function(em, instructions) {
	var betIds = [];
	for ( var i = 0; i < instructions.length; ++i) {
		var desc = instructions[i];
		var bet = new EmulatorBet(em.marketId, desc.selectionId, 
					desc.side, desc.limitOrder.price, 
					desc.limitOrder.size);
		betIds.push(bet.betId);
		em.bets[bet.betId] = bet;
	}
	return betIds;	
}
