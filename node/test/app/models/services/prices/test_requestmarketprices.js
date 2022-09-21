var root = '../../../../../'
	, servicedir = root + 'app/models/services/'
	, request = require(servicedir + 'markets/marketrequests')
	, winston = require(root + 'config/winston')
	, rtc = require(root + 'app/controllers/configcontroller')
	, async = require('async')
	, common = require(servicedir + 'common')
	, betfair = require('betfair')

sysLogger = winston.getSysLogger(); // Invoke global logger
	
	
	
// Create session to Betfair
var session = common.session = betfair.newSession();

session.setApplicationKeys(rtc.getConfig('betfair.applicationkey'))
common.loginName = rtc.getConfig('betfair.user');
common.password = rtc.getConfig('betfair.password');



async.waterfall([common.login, request.listEvents, common.logout], function(err,res) {
    console.log("Done, err =",err);
    process.exit(0);
});
	