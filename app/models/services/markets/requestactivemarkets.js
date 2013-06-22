/**
 * Module Dependencies
 */
var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
 	, config = require(root + 'config/config')[env]
	, betfair = require('betfair')
	, common = require(servicedir + 'common')






// list countries
exports.listEvents = function(filter, cb)  {
    if(!cb) 
        cb = filter;
    console.log('Filter : '); 
    console.log(filter); 
    
    var session = common.session;
    
    session.listCompetitions({ "filter": {"CompetitionId" : "23"}}, function(err,res) {
    	if(err) console.log(err)
        console.log("listEvents err=%s duration=%s", err, res.duration/1000);
        console.log("Request:%s\n", JSON.stringify(res.request, null, 2))
        console.log("Response:%s\n", JSON.stringify(res.response, null, 2));
        cb(err,res);
    });
}


exports.getAllActiveMartkets = function (session, eventType, callback) {

    // eventTypeIds 1-soccer, 2-tennis
    var inv = session.getAllMarkets({
        eventTypeIds : [ eventType ]
    });
    inv.execute(function(err, res) {
        // sysLogger.info('Action:', res.action, '\nError:', err, '\nDuration:', res.duration() / 1000);
        if (err) { 
        	sysLogger.error('<requestactivemarkets.getAllMarkets> <error>' );
        	callback(err); 
        }
        var markets = res.result.marketData.filter(function(m) {
            return m.marketName === config.api.marketName;
        });
        // sort by eventDate descending
        markets.sort(function(first, second) {
            return second.eventDate - first.eventDate
        });
        
        
        callback(markets);
    });
}

