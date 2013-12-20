var winston = require('winston');

// Load configurations
var root = '../'
	, rtc = require(root + 'app/controllers/configcontroller');
 
require('winston-mongodb').MongoDB;

exports.getSysLogger = function() {
	var sysLogger = new (winston.Logger)({
	  transports: [
	    new winston.transports.Console({level: rtc.getConfig('logs.level') , json: false, timestamp: true }),
	    new winston.transports.File({ filename: rtc.getConfig('root') + rtc.getConfig('syslogfile') , json: false, timestamp: true })
	  ],
	  exitOnError: false
	});
	sysLogger.setLevels(winston.config.syslog.levels);
	return sysLogger;
};

exports.getApiLogger = function() {
  var apiLogger = new (winston.Logger)({
        transports: [
                new winston.transports.MongoDB({ db: rtc.getConfig('logs.db') , collection: rtc.getConfig('logs.collection.prices'), level: rtc.getConfig('logs.level')})
                ]
                });             
  return apiLogger;
 };

 