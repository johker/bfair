/**
 * Module Dependencies
 */
var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
 	, config = require(root + 'config/config')[env]
	, betfair = require('betfair')
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
    	if(err) sysLogger.error('<marketrequests> <listEvents>' + JSON.stringify(err))
        sysLogger.debug("<marketrequests> <listEvents> Request:%s\n", JSON.stringify(res.request, null, 2))
        sysLogger.debug("<marketrequests> <listEvents> Response:%s\n", JSON.stringify(res.response, null, 2));
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
		var resf = eventfilter.byPlayer(res.response.result); 
		var mids = [];
		for(var i in resf) {
			mids.push(resf[i].event.id);	
		}
		exports.listMarketCatalogue({"filter":{"eventIds":mids},"maxResults":"10","sort":marketfilter.getMarketSort(),"marketProjection":marketfilter.getMarketProjection()}, function(err, res) {
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
	//console.log(filter);
    session.listMarketCatalogue(filter, function(err,res) {
       	if(err) sysLogger.notice("<marketrequests> <listMarketCatalogue> " + JSON.stringify(err));
        sysLogger.debug("<marketrequests> <listMarketCatalogue> Request:%s\n", JSON.stringify(res.request, null, 2))
        sysLogger.debug("<marketrequests> <listMarketCatalogue> Response:%s\n", JSON.stringify(res.response, null, 2));
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



