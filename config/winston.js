var winston = require('winston');

// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
 
require('winston-mongodb').MongoDB;

exports.getSysLogger = function() {
	var sysLogger = new (winston.Logger)({
	  transports: [
	    new winston.transports.Console({level: config.logs.level , json: false, timestamp: true }),
	    new winston.transports.File({ filename: config.root + config.syslogfile , json: false, timestamp: true })
	  ],
	  exitOnError: false
	});
	sysLogger.setLevels(winston.config.syslog.levels);
	return sysLogger;
};

exports.getApiLogger = function() {
  var apiLogger = new (winston.Logger)({
        transports: [
                new winston.transports.MongoDB({ db: config.logs.db , collection: config.logs.collection.prices, level: config.logs.level})
                ]
                });             
  return apiLogger;
 };

 