/**
 * New node file
 */

var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
 	, config = require(root + 'config/config')[env]
	, betfair = require('betfair-sports-api')
 
 
 
exports.getMarketPrices = function(session, marketId, callback) {
    
    sysLogger.info('<requestmarketprices.getMarketPrices> <marketId = ', marketId + '>');
    var inv = session.getMarketPricesCompressed(marketId);
    inv.execute(function(err, res) {
        console.log('action:', res.action, 'error:', err, 'duration:',
                res.duration() / 1000);
        if (err) {
            callback("Error in getMarketPricesCompressed", null);
        }
        //console.log(util.inspect(res.result, false, 10));

        var marketPrices = res.result.marketPrices;
        /*
        console.log("marketId:", market.marketId);
        console.log("currency:", market.currency);
        console.log("marketStatus:", market.marketStatus);
        console.log("inPlayDelay:", market.inPlayDelay);
        // print players info
        for ( var playerIndex = 0; playerIndex < market.runners.length; ++playerIndex) {
            console.log("player %s", playerIndex);
            var runner = market.runners[playerIndex];
            console.log("\tselectionId:", runner.selectionId);
            console.log("\tlastPriceMatched:", runner.lastPriceMatched);
            console.log("\ttotalMatched:", runner.totalMatched);
            for ( var cnt = 0; cnt < runner.backPrices.length; ++cnt) {
                var item = runner.backPrices[cnt];
                console.log("\t back price:%s amount:%s", item.price, item.amount);
            }
            for ( var cnt = 0; cnt < runner.layPrices.length; ++cnt) {
                var item = runner.layPrices[cnt];
                console.log("\t lay price:%s amount:%s", item.price, item.amount);
            }
        }
        */
        callback(marketPrices);
    });
}

function rest_getMarketsPrices() {

	
}

