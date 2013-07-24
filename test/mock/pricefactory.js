/**
 * New node file
 */

var reqnr = 0
, root = '../../'
, sysLogger = require(root + 'config/winston').getSysLogger()
, utils = require(root + 'util/listutil') 

var ex0 = {
	availableToBack: generatePrices(), 
	availableToLay: generatePrices(), 
	tradedVolume: []
}

var ex1 = {
	availableToBack: generatePrices(), 
	availableToLay: generatePrices(), 
	tradedVolume: []
}

var player0 = { 
	selectionId: 2395156,
	handicap: 0,
	status: 'ACTIVE',
	totalMatched: 2130,
	ex: ex0 
}

var player1 = {
	selectionId: 2395156,
	handicap: 0,
	status: 'ACTIVE',
	totalMatched: 120,
	ex: ex1 
} 


 
function generateResult (mid) {
	return { marketId: mid,
  	isMarketDataDelayed: false,
  	status: 'OPEN',
  	betDelay: 0,
  	bspReconciled: false,
  	complete: true,
  	inplay: false,
  	numberOfWinners: 1,
  	numberOfRunners: 2,
  	numberOfActiveRunners: 2,
  	totalMatched: 10,
  	totalAvailable: 511.7,
  	crossMatching: true,
  	runnersVoidable: false,
  	version: 553507792,
 	runners: [player0, player1]
 	}
}
 

 
exports.getPrices = function(marketIds, callback) {
	sysLogger.info('<pricefactory> <getPrices>');
	var results = []
	for(var i = 0; i< marketIds.length; i++) {
		results.push(generateResult(marketIds[i])); 
	}
	if(reqnr == 1) 
		changePrices();
	if(reqnr % 2 == 0) {
		changePrices();
	}
	reqnr++; 
	callback(results);
}


function changePrices() {
	var pricerange = generatePrices();
	ex0['availableToBack'] = pricerange.splice(3,6)
	ex0['availableToLay'] = pricerange.splice(0,3)
	pricerange = generatePrices();
	ex1['availableToBack'] = pricerange.splice(3,6)
	ex1['availableToLay'] = pricerange.splice(0,3)
	// runners = [}
}

function generatePrices() {
	var prices = [
		{price: createRN(10), size: createRN(100)},
		{price: createRN(10), size: createRN(100)}, 
		{price: createRN(10), size: createRN(100)},
		{price: createRN(10), size: createRN(100)},
		{price: createRN(10), size: createRN(100)}, 
		{price: createRN(10), size: createRN(100)}
		
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


/* TEST 
exports.getPrices([ '1.110165036', '1.110165037'], function(data) {
	console.log(data[0].runners[0].ex.availableToLay); 
	changePrices(); 
	console.log(data[0].runners[0].ex.availableToLay); 
}); 
*/