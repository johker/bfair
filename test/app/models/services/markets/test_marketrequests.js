// Environment modules 

var env = process.env.NODE_ENV || 'development'
	, root = '../../../../../'
	, servicedir = root + 'app/models/services/'
	, config = require(root + 'config/config')[env]
	, betfair = require('betfair')
	, async = require('async')
	, winston = require(root + 'config/winston');

// GLOBAL variables
sysLogger = winston.getSysLogger()
	
	
// Test modules
var session = require(servicedir + 'session')
	, instance = session.Singelton.getInstance()
	, request = require(servicedir + 'markets/marketrequests')

	
instance.login(function(err, res){
 	sysLogger.info('<test_marketrequests> Logged in to Betfair');
 	request.listMarkets( { "filter": {"eventTypeIds" : [2], "turnsInPlay" : true}}, function(err, res) {
		//console.log(res); 
	});
 });	


/*
function filter(par, cb) {
	cb(null, { "filter": {"eventTypeIds" : [2], "turnsInPlay" : true}});
}

async.waterfall([instance.login, filter, request.listMarkets, instance.logout], function(err,res) {
    sysLogger.info('<marketqequests_test> <async.waterfall> res.response = ' + res.response);
    process.exit(0);	
});
*/

	