var env = process.env.NODE_ENV || 'development'
	, root = '../../../../../'
	, servicedir = root + 'app/models/services/'
	, winston = require(root + 'config/winston')
	, config = require(root + 'config/config')[env]
	, async = require('async')
	, assert = require('assert')
	, expect = require('expect.js')
	sysLogger = winston.getSysLogger(); // Invoke global logger
	
	
var request = require(servicedir + 'markets/marketrequests')
	, common = require(servicedir + 'common')
	, betfair = require('betfair')
	
// Create session to Betfair
var session = common.session = betfair.newSession(config.betfair.applicationkey);
common.loginName = config.betfair.user;
common.password = config.betfair.password;

function filter(par, cb) {
	cb(null, { "filter": {"eventTypeIds" : [2], "turnsInPlay" : true}});
}


common.login(function(err, res) {
	request.listMarkets( { "filter": {"eventTypeIds" : [2], "turnsInPlay" : true}}, function(err, res) {
		console.log(res); 
	});
});

	/*

var marketfilter = require(servicedir + 'filter/marketfilter'); 
common.login(function(err, res) {
	request.listMarketCatalogue( {"filter":{"eventIds":["27029410"], "marketTypeCodes": marketfilter.getTypes()}}, function(err, res) {
		 console.log(res.response.result);
	});
});
*/

/*
async.waterfall([common.login, filter, request.listEvents, common.logout], function(err,res) {
    sysLogger.info('<marketqequests_test> <async.waterfall> res.response = ' + res.response);
    process.exit(0);	
});
*/
	