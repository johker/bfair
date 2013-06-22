var env = process.env.NODE_ENV || 'development'
	, root = '../../'
	, servicedir = root + 'app/models/services/'
	, winston = require(root + 'config/winston')
	, config = require(root + 'config/config')[env]
	, async = require('async');
sysLogger = winston.getSysLogger(); // Invoke global logger
	
	
var request = require(servicedir + 'markets/requestactivemarkets')
	, common = require(servicedir + 'common')
	, betfair = require('betfair')



	
// Create session to Betfair
var session = common.session = betfair.newSession(config.betfair.applicationkey);
common.loginName = config.betfair.user;
common.password = config.betfair.password;

 





async.waterfall([common.login, request.listEvents, common.logout], function(err,res) {
    console.log("Done, err =",err);
    process.exit(0);
});
	