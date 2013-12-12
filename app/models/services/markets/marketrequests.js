/**
 * Module Dependencies
 */
var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
 	, config = require(root + 'config/config')[env]
	, _ = require('underscore')
	, eventfilter = require(servicedir + 'filter/eventfilter')
	, marketfilter = require(servicedir + 'filter/marketfilter') 
	, session =  require(servicedir + 'session').Singelton.getInstance().getSession();
	

/**
* Returns a list of Events associated with the 
* markets selected by the MarketFilter.
*/
exports.listEvents = function(filter, cb)  {
	if(!cb) cb = filter;  // cb is first parameter    
    session.listEvents(filter, function(err,res) {
    	if(err) sysLogger.error('<marketrequests> <listEvents> ' + JSON.stringify(err));
       cb(err,res);
    });
}


/**
* Couples requests for events and markets by applying the 
* name filter.
*/
exports.listMarkets = function(filter, cb) {
	sysLogger.notice('<marketrequests> <listMarkets> filter: ' + JSON.stringify(filter));
	exports.listEvents(filter, function(err, res) {
		var events = res.response.result; 		
		var eids = [];
		// Only one id for testing purposes
		if(config.api.applyEventId) {
 			eids = [config.api.testEventId];
 		} else {
 			eids = eventfilter.getFilteredEventIds(events);
 		}
 		exports.listMarketCatalogue({"filter":{"eventIds":eids},"maxResults":config.api.maxResults,"sort":marketfilter.getMarketSort(),"marketProjection":marketfilter.getMarketProjection()}, function(err, res) {
			 cb(err,res.response.result);
		});
		
	});
} 




/**
* Returns a list of information about markets that does not change (or changes very rarely). 
* You use listMarketCatalogue to retrieve the name of the market, the names of selections and other information about markets.
*/
exports.listMarketCatalogue = function(filter, cb)  {
	if(!cb) cb = par;  // cb is first parameter    
    session.listMarketCatalogue(filter, function(err,res) {
       	if(err) sysLogger.notice("<marketrequests> <listMarketCatalogue> " + JSON.stringify(err));
        cb(err,res);
    });
}

/**
* Returns a list of dynamic data about markets. Dynamic data includes prices, the status of the market, 
* the status of selections, the traded volume, and the status of any orders you have placed in the market.
*/
exports.listMarketBook = function(filter, cb)  {
	if(!cb) cb = par;  // cb is first parameter    
	//console.log(filter);
    session.listMarketBook(filter, function(err,res) {
       	if(err) sysLogger.notice("<marketrequests> <listMarketBook> " + JSON.stringify(err));
        cb(err,res);
    });
}


/**
*
*/ 
exports.listMarketTypes = function(filter, cb) {
	if(!cb) cb = par;  // cb is first parameter   
	 session.listMarketCatalogue(filter, function(err,res) {
	 	if(err) console.log(err)
	    cb(err,res);
    });
} 



