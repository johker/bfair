/**
 * New node file
 */

var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
 	, config = require(root + 'config/config')[env]
	, betfair = require('betfair')
 
 
 
exports.getMarketPrices = function(session, marketId, callback) {
    
    sysLogger.info('<requestmarketprices.getMarketPrices> <marketId = ', marketId + '>');
    var inv = session.getMarketPricesCompressed(marketId);
    inv.execute(function(err, res) {
        console.log('action:', res.action, 'error:', err, 'duration:',
                res.duration() / 1000);
        if (err) {
            callback("Error in getMarketPricesCompressed", null);
        }
        var marketPrices = res.result.marketPrices;
           callback(marketPrices);
    });
}

function rest_getMarketsPrices() {

	
}

