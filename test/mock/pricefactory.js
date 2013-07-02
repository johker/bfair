/**
 * New node file
 */

var reqnr = 0
, root = '../../'
, sysLogger = require(root + 'config/winston').getSysLogger()
, utils = require(root + 'util/listutil') 



var player0 = {
	selectionId: 2538236,
	lastPriceMatched: 1.07,
	totalMatched: 8828.11,
	backPrices: generatePrices(),
	layPrices: generatePrices()
}

var player1 = {
	selectionId: 2256466,
	lastPriceMatched: 15.0,
	totalMatched: 2.95,
	backPrices: generatePrices(),
	layPrices: generatePrices()	
} 
 
 var book = {
	marketId: 109386098,
	currency: 'EUR',
	marketStatus: 'ACTIVE',
	inPlayDelay: 0, 
 	runners: [player0, player1]
}
 
exports.getPrices = function(marketId, callback) {
	sysLogger.info('<pricefactory> <getPrices> marketId: ' + marketId + ', reqnr = ' + ++reqnr);
	book['marketId'] = marketId;	
	// sysLogger.info('reqnr = ' + (++reqnr));
	if(reqnr == 1) 
		changePrices();
	if(reqnr % 2 == 0) {
		changePrices();
	}
	callback(book);
}


function changePrices() {
	var pricerange = generatePrices();
	player0['backPrices'] = pricerange.splice(3,6)
	player0['layPrices'] = pricerange.splice(0,3)
	pricerange = generatePrices();
	player1['backPrices'] = pricerange.splice(3,6)
	player1['layPrices'] = pricerange.splice(0,3)
	// runners = [}
}

function generatePrices() {
	var prices = [
		{price: createRN(10), amount: createRN(100)},
		{price: createRN(10), amount: createRN(100)}, 
		{price: createRN(10), amount: createRN(100)},
		{price: createRN(10), amount: createRN(100)},
		{price: createRN(10), amount: createRN(100)}, 
		{price: createRN(10), amount: createRN(100)}
		
	];
	sort(prices);
	return prices;
}

function sort(prices) {
	prices.sort(function(first, second) {
		return second.price -first.price;
	});
}


function createRN(range) {
	return (Math.random()*range).toFixed(2);
}


function print(book) {
	for ( var playerIndex = 0; playerIndex < book.runners.length; ++playerIndex) {
         console.log("player %s", playerIndex);
         var runner = book.runners[playerIndex];
         console.log("\tselectionId:", runner.selectionId);
         console.log("\tlastPriceMatched:", runner.lastPriceMatched);
         console.log("\ttotalMatched:", runner.totalMatched);
    for ( var cnt = 0; cnt < runner.backPrices.length; ++cnt) {
          var item = runner.backPrices[cnt];
         console.log("\t back price: %s amount: %s", item.price, item.amount);
   }
   for ( var cnt = 0; cnt < runner.layPrices.length; ++cnt) {
        var item = runner.layPrices[cnt];
        console.log("\t lay price: %s amount: %s", item.price, item.amount);
   }
	}
}

