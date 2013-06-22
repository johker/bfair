
var reqnr = 0
, root = '../'
, sysLogger = require(root + 'config/winston').getSysLogger()
, utils = require('../util/listutil') 

var markets = [
    { marketId: '1', eventDate: '1388530800000',  menuPath: '\\Tennis\\ Match 1',  lastRefresh: '1366558706290', totalMatched: '0',  activationTime: Date.now() },
    { marketId: '2', eventDate: '1388534400000',  menuPath: '\\Tennis\\ Match 2',  lastRefresh: '1366558706290', totalMatched: '0',  activationTime: Date.now() },
    { marketId: '3', eventDate: '1388534400000',  menuPath: '\\Tennis\\ Match 3',  lastRefresh: '1366558706290', totalMatched: '0',  activationTime: Date.now() },
    { marketId: '4', eventDate: '1388538000000',  menuPath: '\\Tennis\\ Match 4',  lastRefresh: '1366558706290', totalMatched: '0',  activationTime: Date.now() },
    { marketId: '5', eventDate: '1388538000000',  menuPath: '\\Tennis\\ Match 5',  lastRefresh: '1366558706290', totalMatched: '0',  activationTime: Date.now() }
   ];
    
    

exports.getMarkets = function(callback) {
	sysLogger.debug('<marketfactory> <getMarkets> reqnr = ' + (++reqnr));
	/*	
	if(reqnr % 2 == 0) {
		testAdd();
	}
	*/ 	
	if(reqnr % 3 == 0) {
		testUpdate();		
	}
	if(reqnr % 4 == 0 && reqnr % 8 == 0) {
		testAdd();
	}
	if(reqnr % 4 == 0 && reqnr % 8 != 0) {
		testRemove(); 	
	}
    callback(markets);
}


function testUpdate() {
	for(var i in markets) {
		tm = parseInt(markets[i].totalMatched, 10);			
		sysLogger.debug('<marketfactory> <testUpdate> id = ' + markets[i].marketId + ', tm = ' + (tm + (Math.random()*10).toFixed(2)) + ', new tm = ' +  reqnr);
		markets[i]['totalMatched'] = '' + (tm + (Math.random()*10).toFixed(2));
	}
}

function testRemove() {
	sysLogger.debug('<marketfactory> <testRemove> <id = ' + markets[utils.count(markets)-1].marketId);
	utils.removeFromArray(markets, -1);  
}

function testAdd() {
	var market = { marketId: '' + Math.max(reqnr, utils.count(markets)) , eventDate: '1388530800000',  menuPath: '\\Tennis\\ Match ' +  Math.max(reqnr, utils.count(markets)),  lastRefresh: '1366558706290', totalMatched: '0',  activationTime: Date.now() };
	sysLogger.debug('<marketfactory> <testAdd> id = ' + Math.max(reqnr, utils.count(markets)));
	markets.push(market); 
}

exports.getMockTags = function() {
	return ['Match 2', 'Match 4', 'Match 8', 'Match 16', 'Match 32', 'Match 64'];
}
