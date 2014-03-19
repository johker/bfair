var winston = require('winston');

// Load configurations
var root = '../'
	, rtc = require(root + 'app/controllers/configcontroller')
 	, file
 	
require('winston-mongodb').MongoDB;

exports.getSysLogger = function() {
	var sysLogger = new (winston.Logger)({
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
		    new winston.transports.Console({level: rtc.getConfig('logs.level'), json: false, timestamp: true }),
		    new winston.transports.File({level: rtc.getConfig('logs.level'), filename: exports.getFile(), json: false, timestamp: true })
		  ],
		  exitOnError: false
	});
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
 
exports.getFile = function() {
	if(!file) {
		file = rtc.getConfig('logs.dir') 
	 	+ rtc.getConfig('logs.sysfile') 
	 	+ getTimeAttachment() 
	 	+ rtc.getConfig('logs.ending');
 	}
 	return file; 
}
 
 
function getTimeAttachment() {
	var time = '';
	var now = new Date();
	time += now.getFullYear(); 
	time += ('0' + (now.getMonth()+1)).slice(-2);
	time += ('0' + now.getDate()).slice(-2);
	time += '-'
	time += ('0' + now.getHours()).slice(-2) 
	time += ('0' + now.getMinutes()).slice(-2); 
	return time; 
}


