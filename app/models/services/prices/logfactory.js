/**
 * Returns a winston logger connection to a new mongodb collection ...
 *
 */
var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
 	, config = require(root + 'config/config')[env]
	, _ = require('underscore')
	, winston = require('winston')
	, formatter = require(root +  'util/streamformatter')
	, sysLogger = require(root + 'config/winston').getSysLogger()
	, mongoose = require('mongoose')
	, loggers = {}    // stores loggers with its collection as key

	, LogSchema = generateSchema();




require('winston-mongodb').MongoDB;
var activeLogger;
 
/**
* Returns a winston logger with mongo db collection named 
* after the market id as transport. If not exisitng a new logger 
* is generated. 
*/
exports.getLogInstance = function(mid, callback) {
	var prop = config.logs.collection.prefix + mid;
  	if(_.has(loggers, prop)) {
  		callback(loggers[prop]);
  	} else {
  		sysLogger.notice('<logfactory> <getLogInstance> create new logger instance: ' + prop );
	  	var logger = new (winston.Logger)({
		  	transports: [
		  		new winston.transports.MongoDB({ db: config.logs.db , collection: prop, level: config.logs.level})
		  		]
		  	});  
		loggers[prop] = logger;
	  	callback(logger);
  	}
  	
 }	 

/**
* Removes the winston logger instance from the list. 
*/ 
exports.removeLogInstance = function(mid) {
	var collection = config.logs.collection.prefix + mid;
 	sysLogger.debug('<logfactory> <removeLogInstance> collection: ' + collection);
 	delete loggers[collection];
} 
 
 
/**
* Streams content of collection given by market ID
*/
exports.exportLogInstance = function(mid, res, callback) {
	var collection = config.logs.collection.prefix + mid;
 	sysLogger.notice('<logfactory> <exportLogInstance> collection: ' + collection);
 	closeConnection();
 	streamResults(collection, res, callback);
}


/**
* DUPLICATE CODE in datalogs.js
* Fix for 'Trying to open unclosed connection' error.
*/
function closeConnection() {
	mongoose.connection.close( function(err) {
		if(err) { 
			sysLogger.warn('<datalogs> <closeConnection> '+ 'No Mongoose Connection: Nothing to close...');
		}
	});
}

/**
* DUPLICATE CODE in datalogs.js
* Pipes the Query results to the resonse object using 
* a customized query formatter.
*/ 
function streamResults(collection, res, callback) {
	sysLogger.crit('<logfactory> <streamResults> Accessing logs at ' + 'mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db);
	var db = mongoose.connect('mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db).connection; 
	sysLogger.notice('<logfactory> <streamResults> collection: ' + collection);
	var Data = db.model('Data', generateSchema(), collection);	
	var format = new formatter.createFormatter();	
	var customstream = buildQueryStream(Data, format);
	// Customized format
	var d = new Date();
	res.setHeader('Content-disposition', 'attachment; filename='  + d.fileformat() + '_logsexp' + config.filetype);
	res.writeHead(200, {'Content-Type': 'text/csv; charset=utf-8'}); 
	customstream.pipe(res);
	callback();
}

/**
* Returns a formatted query stream. 
*/
function buildQueryStream(Data, format) {
	return Data.find({}).stream().pipe(format);	
}

/**
* Create structure of db document.
*/
function generateSchema() {
	var schobj = {};
	for(var i = 0; i < 2; i++) {
		for(var j = 0; j < 3; j++) {
			var index = '' + i + j;
			schobj['vb' + index] = String;
			schobj['pb' + index] = String;
			schobj['vl' + index] = String;
			schobj['pl' + index] = String;
		}
	}
	schobj['timestamp'] = Number
	schobj['level'] = String
	schobj['message'] = String
	return new mongoose.Schema(schobj); 
} 


/**  
*Check for DB content. 
*/
exports.testQuery = function(collection) {
	sysLogger.notice('<logfactory> <testQuery>');	
	closeConnection();
	var db = mongoose.connect('mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db).connection; 
	var Data = mongoose.model('Data', LogSchema, collection);
	Data.find({}, function (err, data) {		
		if(err) { sysLogger.error('<logfactory> <streamResults> <Data.find>');} 
		sysLogger.notice('<logfactory> <streamResults>');	
		//console.log(data); 
		db.close(); 
	});
}


//exports.testQuery('mid1.5'); 

