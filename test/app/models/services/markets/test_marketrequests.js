// Environment modules 

var env = process.env.NODE_ENV || 'development'
	, root = '../../../../../'
	, servicedir = root + 'app/models/services/'
	, config = require(root + 'config/config')[env]
	, async = require('async')
	, winston = require(root + 'config/winston');

// GLOBAL variables
sysLogger = winston.getSysLogger()
betfair = require(root + 'app/models/api'); // Patched version 
// betfair = require('betfair'); // node module
	
// Test modules
var session = require(servicedir + 'session')
	, instance = session.Singelton.getInstance()
	, request = require(servicedir + 'markets/marketrequests')

, mid = '1.107453576';
	/*
instance.login(function(err, res){
 	sysLogger.info('<test_marketrequests> Logged in to Betfair');
 	request.listMarketCatalogue( {"filter":{"marketIds":[mid]},"maxResults":"1","marketProjection":["RUNNER_DESCRIPTION"]}, function(err, res) {
		console.log(res.response.result[0]); 
	});
 });	
*/

instance.login(function(err, res){
 	sysLogger.info('<test_marketrequests> Logged in to Betfair');
 	request.listMarketBook({"marketIds":[mid]}, function(err, res) {
		console.log(res.response); 
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

	