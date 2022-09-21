/**
 * Emulator patch 
 * author: johker
 */



 /**
 *
 */
exports.matchBetsUsingPrices = function(em, betlist) {
    betlist = betlist || [];
    for ( var i = 0; i < betlist.length; ++i) {
        var bet = betlist[i];
        var player = em.players[bet.selectionId];
        sysLogger.info('EMU: betId= ' + bet.betId + ', selId = ' + bet.selectionId + ', type = '
                 + bet.betType);
        sysLogger.info('EMU: best back= ' + player.bestBack + ', best lay = ' + player.bestLay);
        if (bet.betType === 'BACK') {
            var bestBackPrice = player.ex.availableToLay[0] ? player.ex.availableToLay[0].price : undefined;
            var bestBackSize = player.ex.availableToLay[0] ? player.ex.availableToLay[0].amount : undefined;
            if (1 * bestBackPrice > 1 * bet.price) {
                bet.matchWhole(bestBackPrice);
            } else if ((Math.abs(bestBackPrice - bet.price) < 0.0001)
                    && (1 * bestBackSize > 1 * bet.size)) {
                bet.matchWhole(bestBackPrice);
            }
        } else if (bet.betType === 'LAY') {
            var bestLayPrice = player.ex.availableToBack[0] ? player.ex.availableToBack[0].price : undefined;
            var bestLaySize =  player.ex.availableToBack[0] ? player.ex.availableToBack[0].amount : undefined;
            if (1 * bestLayPrice < 1 * bet.price) {
                bet.matchWhole(bestLayPrice); 
            } else if ((Math.abs(bestLayPrice - bet.price) < 0.0001)
                    && (1 * bestLaySize > 1 * bet.size)) {
                bet.matchWhole(bestLayPrice);
            }
        }
        
        
        sysLogger.info('<emulator_exchange> <matchBetsUsingPrices> EMU: matched size =  ' + bet.matchedSize());
    } // for
}


exports.matchBetsUsingTradedVolume = function(em, betlist) {
}


exports.handleGetMarketProfitAndLoss = function() {

}