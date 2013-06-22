/**
 * Dependencies
 */
var root = '../../'
	, bundle = require(root + 'config/resourcebundle')['en']
	, servicedir = root + 'app/models/services/'	
	, sessionmodel = require(servicedir + 'sessionloader')
	, strutils = require(root + 'util/stringutil')
	, listutils = require(root + 'util/listutil')	
	, session = require(servicedir + 'sessionloader').getSession()
	, betfair = require('betfair-sports-api')
    , MarketObserver = require(servicedir + 'marketobserver')
    , marketObserver = new MarketObserver()
    , marketrequest = require(servicedir + 'markets/requestactivemarkets')
    , PriceObserver = require(servicedir + 'priceobserver')
    , priceObserver = new PriceObserver()
    , pricerequest = require(servicedir + 'prices/requestmarketprices')
    , MarketPing = require(servicedir + 'markets/pingmarkets')
	, PricePing = require(servicedir + 'prices/pingprices')
	, priceping = new PricePing ({session: session, request: pricerequest.getMarketPrices})
	, marketping = new MarketPing ({session: session, eventType: '2', request: marketrequest.getAllActiveMartkets})
	, history = require(root + 'app/models/db/history')
	, selectedMarketId
	, logs = require(servicedir + 'prices/logfactory')

/**
* Update active markets list
*/
marketping.on('ping', function(markets){
	sysLogger.debug('<apicontroller> <marketping.on:ping>');
	marketObserver.synchronize(markets);			
});	  

/**
* Update database and emit websocket events for GUI. 
*/   
priceping.on('ping', function(prices) {
	sysLogger.debug('<apicontroller> <priceping.on:ping> market ID = ' + prices.marketId);
	priceObserver.synchronize(prices);	
	
});

/**
* Trigger logging for incomming market by adding it to ping list
*/
marketObserver.on('logPrices',function(market) {
	sysLogger.debug('<apicontroller> <marketObserver.on:logPrices>  market ID = ' + market.marketId);
	priceping.addMarket(market);
});

/**
* Remove market from price ping list of markets. Add market to history
*  if logging is enabled. 
*/
marketObserver.on('stopLogging', function(market) {
	sysLogger.debug('<apicontroller marketObserver.on:stopLogging>  market ID = ' + market.marketId + '>');
	priceping.removeMarket(market);	
	priceObserver.passivate(market);
	if(market['isLogged']) {
		sysLogger.debug('<apicontroller marketObserver.on:stopLogging> Add to history, id = ' + market.marketId);
		history.add(market);
		
	} 
});

marketping.start();
priceping.start();
 
exports.login = function(login, password, callback) {
	sessionmodel.login(session, login, password, callback);
 }
 
exports.logout = function(callback) {
	sessionmodel.login(session, callback);
 }
 
exports.getmarketObserver = function() {
	return ;
}

/**
* 
* Broadcast active markets list. Overwrite activation time to unknown
* as this is the initial list. 
* TODO: Declare new event with accumulated information
*/
app.io.route('marketsready', function(req) {	
	var markets = marketObserver.getList();
	for(var i=0; i < markets.length; i++) {
		markets[i]['activationTime'] = undefined;
		app.io.broadcast('newamarket', markets[i]);		
	 }	
	app.io.broadcast('updatecounters', {active: marketObserver.getSize(), logged: marketObserver.getLogCount()});			
})


/**
* 
* Broadcast passivated (historical) markets list. 
*/
app.io.route('historyready', function(req) {	
	var markets = history.getList(function(data, err) {
		for(var i=0; i < data.length; i++) {
			app.io.broadcast('newpmarket', data[i]);		
		}
	});	
})

exports.markets = function(req, res) {		
	res.render('markets',  { title: bundle.title.overview, username: req.user.username});	
};    

app.io.route('viewprdetail', function(data) {
	selectedMarketId = data.data.marketId;
});

exports.pricedetail = function(req, res) {	
	res.render('detail', { title: bundle.title.overview, username: req.user.username, id: selectedMarketId});
}

exports.history = function(req, res) {	
	res.render('history', { title: bundle.title.overview, username: req.user.username});
}

exports.exporthistory = function(mid, res) {
	sysLogger.debug('<apicontroller> <exportHistory>');
	logs.exportLogInstance(mid, res, function(err) {
		if (err) return err; 
	});
}

exports.stopPolling = function(callback) {
 	
}

