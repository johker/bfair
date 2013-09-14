// (C) 2013 Anton Zemlyanov
//
// Betfair Sports API for node
// see Sports API documentation on http://bdp.betfair.com
//

var root = '../../../'
, env = process.env.NODE_ENV || 'development'
, config = require(root + 'config/config')[env]



// Export BetfairSession 
// Used to invoke Betfair JSON-RPC methods
var BetfairSession = require('./betfair_session');
exports.newSession = function (appKey) {
	var bsession = new BetfairSession();
	bsession.setApplicationKeys({active: config.betfair.applicationkey, delayed: config.betfair.delayedapplicationkey});
	return bsession;
};

// Export BetfairPrice
// Used to "normalize" prices to Betfair allowed values
var BetfairPrice = require('./betfair_price');
exports.newBetfairPrice = function (price) {
    return new BetfairPrice(price);
}

