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
	, selectedMarketId
	, marketName 
	, runnerDescription = []
 	, RabbitConnector = require(root + 'app/models/pricing/rabbitconnector')
 	, rc = new RabbitConnector();


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
	//sysLogger.debug('<apicontroller> <priceping.on:ping> market = ' + JSON.stringify(prices));
	priceObserver.synchronize(prices);	
	rc.marketDataUpdate(prices);
});

/**
* Trigger logging for incomming market by adding it to ping list
*/
marketObserver.on('logPrices',function(market) {
	sysLogger.debug('<apicontroller> <marketObserver.on:logPrices>  market ID = ' + (market != undefined ? market.id : 'undefined!'));
	priceping.addMarket(market);
});

/**
* Remove market from price ping list of markets. Add market to history
*  if logging is enabled. 
*/
marketObserver.on('stopLogging', function(market) {
	mid = market.id;
	priceping.removeMarket(market);		
	async.waterfall([function(cb) {cb(null, mid);}, checks.marketIdLength, checks.marketStatus, checks.marketEventType], function(err,res) {
	    if(err) {
	    	sysLogger.error('<marketObserver> <on: stopLogging> ' + err);	  
	    	return; 
	    }    
	});		
	priceObserver.passivate(mid);
	sysLogger.debug('<apicontroller marketObserver.on:stopLogging> Add to history, id = ' + mid);
	history.add(market);
});

marketping.start();
priceping.start();
 

/**
* 
* Broadcast active markets list. 
* TODO: Declare new event with accumulated information
*/
app.io.route('marketsready', function(req) {
	if(marketObserver.getList().length == 0) {
		sysLogger.debug('<apicontroller> event: marketsready - Fetching List...');
		marketping.initialRequest();
	}
	var markets = marketObserver.getList();	
	for(var i=0; i < markets.length; i++) {
		app.io.broadcast('addmarket', markets[i]);		
	 }	
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
* Get price information independent of poll cycle for initial detail page call
*/
app.io.route('detailsready', function(req) {		
    var mid = '1.' +  req.data.id;
	var filter = {"marketIds": [mid], "priceProjection":{"priceData":["EX_BEST_OFFERS"]}}
	pricerequest.listMarketBook(filter, function(err, res) {
		app.io.broadcast('tick_' + req.data.id, res.response.result[0]);
	});
})

/**
* 
* Broadcast market detail information for initial detail page call. 
*/
app.io.route('detailpageready', function(req) {  
    app.io.broadcast('runnerdesc', {runnerDescription: runnerDescription, marketName: marketName});

})


exports.markets = function(req, res) {		
	res.render('markets',  { title: bundle.title.overview, username: req.user.username});	
};    

exports.orders = function(req, res) {		
	res.render('orders',  { title: bundle.title.overview, username: req.user.username});	
};   

exports.rules = function(req, res) {		
	res.render('rules',  { title: bundle.title.overview, username: req.user.username});	
};   

/**
* Market view sets values. Routing is done by method 'pricedetail'
*/
app.io.route('viewprdetail', function(m) {
	try {
		selectedMarketId = m.data.marketId;	
		marketrequests.listMarketCatalogue({"filter":{"marketIds":['1.' + selectedMarketId]},"maxResults":"10","marketProjection":["RUNNER_DESCRIPTION"]}, function(err, res) {
			runnerDescription = res.response.result[0].runners;
			marketName = res.response.result[0].marketName;
		}); 
	} catch (err) {
		sysLogger.crit('<apicontroller> <app.io.route:viewprdetail> Parsing parameters failed, error: ' + err);
	}
	
});

exports.pricedetail = function(req, res) {	
	res.render('detail', { title: bundle.title.overview, username: req.user.username, id: selectedMarketId});			
}

exports.history = function(req, res) {	
	res.render('history', { title: bundle.title.overview, username: req.user.username});
}

exports.exporthistory = function(mid, res) {
	sysLogger.crit('<apicontroller> <exportHistory> mid = ' +  mid);
	logs.exportLogInstance(mid, res, function(err) {
		if (err) return err; 
	});
	
}

exports.removehistory = function(mid) {
	sysLogger.debug('<apicontroller> <removehistory>');
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

