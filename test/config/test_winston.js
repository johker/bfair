/**
 * New node file
 */

var winston = require('winston');


var root = '../../'
	, rtc = require(root + 'app/controllers/configcontroller')
 	, file
 	, custwinston = require(root + 'config/winston')


 	
 	
 	

logger = new (winston.Logger)({
	  levels: {
		'emergency': 7, // system is unusable
	    'alert': 6,		// action must be taken immediately
	    'critical': 5,  // the system is in critical condition
	    'error': 4,		// error condition
	    'warning': 3,	// warning condition
	    'notice': 2,	// a normal but significant condition
	    'info' : 1,		// a purely informational message
	    'debug' : 0		// messages to debug an application
	  },
	  transports: [
	    new (winston.transports.Console)({level: 'notice', json: false, timestamp: true})
	  ]
	});
 

	
 
 
 var sysLogger = custwinston.getSysLogger(); 
 
 sysLogger.debug('SysLogger Debug Message');
 sysLogger.error('SysLogger Error Message');
 
 
 logger.debug('Debug Message');
 logger.warning('Warning Message');
 logger.error('Error Message');