/**
 * Dependencies
 */
var root = '../../'
	, env = process.env.NODE_ENV || 'development'
	, bundle = require(root + 'config/resourcebundle')['en']
	, servicedir = root + 'app/models/services/'	
	, config = require(root + 'config/config')[env]
	, strutils = require(root + 'util/stringutil')
	, listutils = require(root + 'util/listutil')	
	, betfair = require('betfair')
    , MarketObserver = require(servicedir + 'marketobserver')
    , marketObserver = new MarketObserver()
    , PriceObserver = require(servicedir + 'priceobserver')
    , priceObserver = new PriceObserver()
    , MarketPing = require(servicedir + 'markets/pingmarkets')
	, PricePing = require(servicedir + 'prices/pingprices')
	, priceping = new PricePing ({session: session})
	, marketping = new MarketPing ({session: session, eventType: '2'})
	, history = require(root + 'app/models/db/history')
	, selectedMarketId
	, logs = require(servicedir + 'prices/logfactory')
	, session = require(servicedir + 'session')


session.Singelton.getInstance().login(function(err, res){
 	sysLogger.info('<apicontroller> Logged in to Betfair');
 });
 
 
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
	sysLogger.notice('<apicontroller> <marketObserver.on:logPrices>  market ID = ' + market.marketId);
	priceping.addMarketId(market.marketId);
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
 

/**
* 
* Broadcast active markets list. Overwrite activation time to unknown
* as this is the initial list. 
* TODO: Declare new event with accumulated information
*/
app.io.route('marketsready', function(req) {
	sysLogger.info('<apicontroller> event: marketsready');	
	var markets = marketObserver.getList();
	for(var i=0; i < markets.length; i++) {
		markets[i]['activationTime'] = undefined;
		app.io.broadcast('addmarket', markets[i]);		
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

