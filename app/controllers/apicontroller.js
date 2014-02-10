/**
 * Dependencies
 */
var root = '../../'
	, env = process.env.NODE_ENV || 'development'
	, servicedir = root + 'app/models/services/'	
	, bundle = require(root + 'config/resourcebundle')['en']
	, rtc = require(root + 'app/controllers/configcontroller')
	, strutils = require(root + 'util/stringutil')
	, listutils = require(root + 'util/listutil')	
	, async = require('async')
    , MarketObserver = require(servicedir + 'markets/marketobserver')
    , marketObserver = new MarketObserver()
    , marketrequests = require(servicedir + 'markets/marketrequests')
    , checks = require(servicedir + 'checks')
    , PriceObserver = require(servicedir + 'prices/priceobserver')
    , priceObserver = new PriceObserver()
    , pricerequest = require(servicedir + 'prices/pricerequests')
    , MarketPing = require(servicedir + 'markets/pingmarkets')
	, PricePing = require(servicedir + 'prices/pingprices')
	, priceping = new PricePing ({session: session})
	, marketping = new MarketPing ({session: session})
	, history = require(root + 'app/models/db/history')
	, logs = require(servicedir + 'prices/logfactory')
	, cleandb = require(root + 'setup/clean')
	, session = require(servicedir + 'session')
	, expressValidator = require('express-validator')
	, bundle = require(root + 'config/resourcebundle')['en']
	, validationutil = require(root + 'util/validation')  
	, notifier = require(root + 'app/models/services/notifier')	
	// Detail Information
	, selectedMarketId, selectedEventId
	, marketName 
	, runnerDescription = []
 	, RabbitConnector = require(root + 'app/models/pricing/rabbitconnector')
 	, rc = new RabbitConnector()
 	, OrderObserver = require(servicedir + 'orders/orderobserver')
	, orderobserver = new OrderObserver()
	, reporting = require(servicedir + 'results/reporting')
	, ResultPing = require(servicedir + 'results/pingresults')
	, resultping = new ResultPing()

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
	priceObserver.synchronize(prices);	
	rc.marketDataUpdate(prices);
});

resultping.on('ping', function(results) {
	sysLogger.crit('<apicontroller> <resultsping.on:ping> ' + JSON.stringify(results));
	reporting.assignWinners(results);
});

/**
* Trigger logging for incomming market by adding it to ping list
*/
marketObserver.on('newMarket',function(market) {
	if(market == undefined) return; 
	sysLogger.debug('<apicontroller> <marketObserver.on:newMarket>  market ID = ' + market.id);	
	priceping.addMarket(market);
});

/**
* Remove market from price ping list of markets. Add market to history. 
*/
priceObserver.on('marketSuspension', function(mid) {
	sysLogger.crit('<apicontroller> <on: marketSuspension> Market Passivation (' + mid + ')');	 		
	
	priceping.removeMarket(mid);	
	// Additional Checks to verify 
	async.waterfall([function(cb) {cb(null, mid);}, 
			checks.marketIdLength, 
			checks.marketStatusClosed, 
			checks.marketEventType
	], function(err, marketId) {
		if(err) {
		    sysLogger.error('<apicontroller> <marketObserver> <on: stopLogging> ' + JSON.stringify(err));	  
		    return; 
		} else {			    
			reporting.addMarketToResults(orderobserver, marketId, function(err){ });		         
		  }
	});		
});

marketping.start();
priceping.start();
resultping.start();
 

/**
* 
* Broadcast active markets list. 
* TODO: Declare new event with accumulated information
*/
app.io.route('marketsready', function(req) {
	if(marketObserver.getList().length == 0 || rtc.getConfig('api.applyLock')) {
		sysLogger.crit('<apicontroller> event: marketsready - Fetching List...');
		marketping.intitialRequest();
	}
	var markets = marketObserver.getList();	
	for(var i=0; i < markets.length; i++) {
		app.io.broadcast('addmarket', markets[i]);	
	 }	
	var ordmarkets = orderobserver.getMarketsWithOrders();
	for(var i=0; i < ordmarkets.length; i++) {
		sysLogger.debug('<apicontroller> <marketsready> ' + ordmarkets[i].marketId);
		app.io.broadcast('addbadge', ordmarkets[i]);		
	} 
	priceObserver.broadcastStatuses();
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

/**
* 
* Get results 
*/
app.io.route('resultsready', function(req) {		
    var results = reporting.getResultList();  
	for(var i = 0; i<results.length; i++) {
		app.io.broadcast('updateresults', results[i]);
	}
})


/**
* 
* Get price information independent of poll cycle for initial detail page call
*/
app.io.route('detailsready', function(req) {		
    var mid = '1.' +  req.data.id;
	var filter = {"marketIds": [mid], "priceProjection":{"priceData":["EX_BEST_OFFERS"]}}
	pricerequest.listMarketBook(filter, function(err, res) {  // Broadcast all current prices
		app.io.broadcast('tick_' + req.data.id, res.response.result[0]);
	});
})

/**
* 
* Broadcast market detail information for initial detail page call. 
*/
app.io.route('detailpageready', function(req) { 
 	var mid = '1.' +  req.data.id; 
	var theoreticals = orderobserver.getTheoreticalsList();
	for(var i=0; i < theoreticals.length; i++) { // Send all theoretical prices for this market
		if(theoreticals[i].marketId == mid) {
			app.io.broadcast('theoretical_'+req.data.id, theoreticals[i]);	
		}	
	} 
	// Send all current orders
	// TODO: as asnyc parallel 
	// CHECK BUG: intial liabilities
	orderobserver.updateCurrentOrderInformation(mid, true, function(err, sidBets) {
		if(err) {
			sysLogger.error('<orderobserver> <updateCurrentOrderInformation> ' + JSON.stringify(err));
			return;
 		}	
	}); 	
	app.io.broadcast('runnerdesc', {runnerDescription: runnerDescription, marketName: marketName});	

})


exports.markets = function(req, res) {		
	res.render('markets',  { title: bundle.title.overview, username: req.user.username, locked: rtc.getConfig('api.applyLock'), eid: rtc.getConfig('api.lockedEventId'), mid: rtc.getConfig('api.lockedMarketId')});	
};    

exports.orders = function(req, res) {		
	res.render('results',  { title: bundle.title.overview, username: req.user.username});	
};   
	
/**
* Market view sets values. Routing is done by method 'pricedetail'
*/
app.io.route('viewprdetail', function(m) {
	try {
		selectedMarketId = m.data.marketId;	
		selectedEventId = m.data.eventId;
		marketrequests.listMarketCatalogue({"filter":{"marketIds":['1.' + selectedMarketId]},"maxResults":"10","marketProjection":["RUNNER_DESCRIPTION"]}, function(err, res) {
			runnerDescription = res.response.result[0].runners;
			marketName = res.response.result[0].marketName;
		}); 
	} catch (err) {
		sysLogger.crit('<apicontroller> <app.io.route:viewprdetail> Parsing parameters failed, error: ' + err);
	}
	
});

exports.pricedetail = function(req, res) {	
	if(rtc.getConfig('api.applyLock') && '1.' + selectedMarketId == rtc.getConfig('api.lockedMarketId')) {
		res.render('detail', { title: bundle.title.overview, username: req.user.username, mid: selectedMarketId, eid: selectedEventId, locked: true});			
	} else {
		res.render('detail', { title: bundle.title.overview, username: req.user.username, mid: selectedMarketId, eid: selectedEventId, locked: false});			
	}
}

exports.history = function(req, res) {	
	res.render('history', { title: bundle.title.overview, username: req.user.username});
}

exports.exporthistory = function(mid, res) {
	sysLogger.debug('<apicontroller> <exportHistory> mid = ' +  mid);
	logs.exportLogInstance(mid, res, function(err) {
		if (err) return err; 
	});
	
}

exports.removehistory = function(mid) {
	cleandb.removeEntry(mid); 
	app.io.broadcast('stalepmarket', mid);
}

exports.removecompletehistory = function() {
	sysLogger.debug('<apicontroller> <removecompletehistory>');
	cleandb.removePrices(); 
	app.io.broadcast('reset');
}

/**
* DEPRECATED
*/
exports.validateorder = function(req, res, callback) {
	sysLogger.info('<apicontroller> <validateorder> ');
	req.assert('price', bundle.validation.novalidprice).isNumber();
	req.assert('size',bundle.validation.novalidsize).isNumber();
	var errMsgs = validationutil.inspect(req.validationErrors());
	var values = {};
	if(errMsgs != null) {
		values = invalidate(errMsgs); 
	} else {
		execute(req);
		values = confirm();
	}
	callback(values);
}

expressValidator.Validator.prototype.isNumber = function() {
	if(!validationutil.isNumber(this.str)) {
		this.error(this.msg || 'Invalid number');
	}
	return this;		
} 

function execute(req) {
	sysLogger.info('<apicontroller> <execute> order confirmation');
	var info = 'SID: ' + req.body.sid +  '\nType: ' +  req.body.type
				+ '\nSide: ' + req.body.side + '\nPrice: ' + req.body.price 
				+ '\nSize: ' + req.body.size + '\nOperation' + req.body.operation;   
	notifier.sendMail('Order Execution',  'Parameters: \n' +  info); 
	
	
}

/**
* Returns 'values' object with existing error messages .
*/
function invalidate(errMsgs) {
	var values = {};
	values.title = bundle.title.data;
	values.errorTitle = bundle.validation.errtitle;
	values.errors = errMsgs;
	return values;
}

/**
* Returns 'values' object with confimration messages
*/
function confirm() {
	var values = {};
	values.title = bundle.title.data;
	values.conftitle = bundle.confirmation.title;
	values.confcontent = [bundle.confirmation.orderex];
	values.errorTitle = undefined; 
	values.errors = undefined;
	return values; 
}

exports.stopPolling = function(callback) {
 	
}

