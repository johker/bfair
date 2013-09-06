var env = process.env.NODE_ENV || 'development'
	,  root = '../../../../../'
	, servicedir = root + 'app/models/services/'
	, request = require(servicedir + 'markets/marketrequests')
	, winston = require(root + 'config/winston')
	, config = require(root + 'config/config')[env]
	, async = require('async')
	, common = require(servicedir + 'common')
	, betfair = require('betfair')

sysLogger = winston.getSysLogger(); // Invoke global logger
	
	
	
// Create session to Betfair
var session = common.session = betfair.newSession();

session.setApplicationKeys(config.betfair.applicationkey)
common.loginName = config.betfair.user;
common.password = config.betfair.password;



async.waterfall([common.login, request.listEvents, common.logout], function(err,res) {
    console.log("Done, err =",err);
    process.exit(0);
});
	