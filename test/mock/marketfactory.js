
var reqnr = 0
, root = '../../'
, sysLogger = require(root + 'config/winston').getSysLogger()
, utils = require(root + 'util/listutil') 

var markets = [
    { marketId: '1.1', marketName: 'Set x Winner',   eventType: { id: '2', name: 'Tennis' }, description: getDescription(), event: getEvent('1')},
    { marketId: '1.2', marketName: 'Set x Winner',   eventType: { id: '2', name: 'Tennis' }, description: getDescription(), event: getEvent('2')},
    { marketId: '1.3', marketName: 'Set x Winner',   eventType: { id: '2', name: 'Tennis' }, description: getDescription(), event: getEvent('3')},
    { marketId: '1.4', marketName: 'Set x Winner',   eventType: { id: '2', name: 'Tennis' }, description: getDescription(), event: getEvent('4')},
    { marketId: '1.5', marketName: 'Set x Winner',   eventType: { id: '2', name: 'Tennis' }, description: getDescription(), event: getEvent('5')},        
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
	}
}

function testRemove() {
	sysLogger.debug('<marketfactory> <testRemove> <id = ' + markets[utils.count(markets)-1].marketId);
	utils.removeFromArray(markets, -1);  
}

function testAdd() {
	var market ={ marketId: '1.' + Math.max(reqnr, utils.count(markets)), marketName: 'Set x Winner',   eventType: { id: '2', name: 'Tennis' }, description: getDescription(), event: getEvent('1.' + Math.max(reqnr, utils.count(markets)))};
	sysLogger.debug('<marketfactory> <testAdd> id = ' + Math.max(reqnr, utils.count(markets)));
	markets.push(market); 
}

function getDescription() {
	return { persistenceEnabled: true,
       bspMarket: false,
       marketTime: '2013-07-25T02:00:00.000Z',
       suspendTime: '2013-07-25T02:00:00.000Z',
       bettingType: 'ODDS',
       turnInPlayEnabled: true,
       marketType: 'SET_WINNER',
       marketBaseRate: 5,
       discountAllowed: true,
       wallet: 'UK wallet',
       rules: '<b>Market Information</b><br>For further information please see <a href=http://content.betfair.com/aboutus/content.asp?sWhichKey=Rules%20and%20Regulations#undefined.do style=color:0163ad; text-decoration: underline; target=_blank>Rules & Regs</a>.<br><br> Who will win the stated set in this match? At the start of play all unmatched bets will be cancelled and this market will be turned in-play. This market will not be actively managed therefore it is the responsibility of all users to manage their positions. If the stated set is not completed all bets on this market will be void. <br><b><br>Customers should be aware that:<br><br>\n<li>Transmissions described as â€œliveâ€? by some broadcasters may actually be delayed and that all in-play matches are not necessarily televised.</li><br><li>The extent of any such delay may vary, depending on the set-up through which they are receiving pictures or data.</li><br><br></b>',
       rulesHasDate: true }
} 

function getEvent(eid) {
	return { id: eid,
       name: 'Test Player 0 v Test Player 1',
       countryCode: 'US',
       timezone: 'US/Pacific',
       openDate: '2014-01-01T01:00:00.000Z' } 
}

exports.getMockTags = function() {
	return ['Match 2', 'Match 4', 'Match 8', 'Match 16', 'Match 32', 'Match 64'];
}
