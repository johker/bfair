/**
 * Emulator patch 
 * author: johker
 */
 var betfairPrice = require('./betfair_price');

var minimumBetSize = 2.0; // GBP
var maximumBetSize = 10000.0; //? GBP 

/**
* Check a single bet item from placeBets bets list
*/
exports.checkPlaceBetItem = function(em, desc) {

    if (!desc.limitOrder ||
    	( desc.limitOrder.persistenceType !== 'LAPSE' 
    	&& desc.limitOrder.persistenceType !== 'PERSIST'
    	&& desc.limitOrder.persistenceType !== 'MARKET_ON_CLOSE'))
        return 'INVALID_PERSISTENCE';

    if (desc.side !== 'BACK' && desc.side !== 'LAY')
        return 'INVALID_BET_TYPE';

    var price = betfairPrice.newBetfairPrice(desc.price);
    if (Math.abs(price.size - 1 * desc.price) > 0.0001)
        return 'INVALID_PRICE';

    if (!em.players[desc.selectionId])
        return 'SELECTION_REMOVED';

    if (1 * desc.size < minimumBetSize || 1 * desc.size > maximumBetSize)
        return 'INVALID_SIZE';

    // no checks failed, then bet is OK
    return null;
}

/**
* Check a single bet item from updateBets bets list
*/
exports.checkUpdateBetItem = function(em, desc) {
    throw new Error('Not yet implemented');
}

/**
* Check a single bet item from cancelBets bets list
*/
exports.checkCancelBetItem = function(em, desc) {
    // check betId is mine
    if (!em.bets[desc.betId]) {
        // MARKET_IDS_DONT_MATCH - Bet ID does not exist
        return 'MARKET_IDS_DONT_MATCH';
    }

    return null;
}


 /**
 *
 */
exports.matchBetsUsingPrices = function(em, betlist) {
    betlist = betlist || [];
    for ( var i = 0; i < betlist.length; ++i) {
        var bet = betlist[i];
        var player = em.players[bet.selectionId];
        console.log("EMU: betId=%d selId=%s type=%s", bet.betId, bet.selectionId,
                bet.betType);
        console.log('EMU: best back=%j lay=%j', player.bestBack, player.bestLay);
        if (bet.betType === 'B') {
            var bestBackPrice = player.bestBack.price;
            var bestBackSize = player.bestBack.amount;
            if (1 * bestBackPrice > 1 * bet.price) {
                bet.matchWhole(bestBackPrice);
            } else if ((Math.abs(bestBackPrice - bet.price) < 0.0001)
                    && (1 * bestBackSize > 1 * bet.size)) {
                bet.matchWhole(bestBackPrice);
            }
        } else if (bet.betType === 'L') {
            var bestLayPrice = player.bestLay.price;
            var bestLaySize = player.bestLay.amount;
            if (1 * bestLayPrice < 1 * bet.price) {
                bet.matchWhole(bestLayPrice);
            } else if ((Math.abs(bestLayPrice - bet.price) < 0.0001)
                    && (1 * bestLaySize > 1 * bet.size)) {
                bet.matchWhole(bestLayPrice);
            }
        }
        console.log("EMU: matched size=", bet.matchedSize());
    } // for
}


exports.matchBetsUsingTradedVolume = function(em, betlist) {
}


