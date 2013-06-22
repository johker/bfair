
/**
* DEPRECATED
*/

// Load configurations
var env = process.env.NODE_ENV || 'development'
	, root = '../../../'
 	, config = require(root + 'config/config')[env]
	, async = require('async')
	, su = require(root + 'util/stringutil')
	, mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, dataSchema = new Schema({ timestamp: Date, description: String, marketId: Number})
	, formatter = require(root +  'util/streamformatter')
	, sysLogger = require(root + 'config/winston').getSysLogger()
	, eventId
	, from
	, to
	, Data;






/**
UNCOMMENT TO DROP COMPLETE HISTORY

removeResults(function(nr, err) {
	sysLogger.info('<datalogs> <removeResults> Success!'); 
});  

*/

/**
* Takes a string as input and creates a date object with the parameters
* year, month, day, hour, minute, second, millisecond 
* where months are 0-based. 
*/
var parseDate = function(input) {
  if(input == null) return null;
  var parts = input.match(/(\d+)/g);
  if(parts == null) return null;  
  return new Date(parts[2], parts[1]-1, parts[0], parts[3], parts[4], parts[5], 0); // months are 0-based
}

/**
* Set query parameters, closes exisiting connections and 
* stream query results to res object. 
*/
exports.exportLogs = function(eid, start, end, res, callback) {
	eventId = eid;
	from = su.parseDate(start); 
	to = su.parseDate(end);	
	sysLogger.debug('eventId = ' + eid); 
	sysLogger.debug('from = ' + from); 
	sysLogger.debug('to = ' + to); 	 	
    closeConnection();
    streamResults(res, callback);
};

module.exports.removeLogs = function(eid, start, end, callback) {
	eventId = eid;
	from = su.parseDate(start); 
	to = su.parseDate(end);		
    closeConnection();
    removeResults(callback);
};

/**
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
* Executes a query and logs results usind sysLogger
*/
function executeQuery(callback) {
	getQuery(function(query,err) {
		query.exec(function(err, docs){
		if(err) return sysLogger.error('<datalogs> <executeQuery> '+ err);
		 	sysLogger.info(docs);
		 	callback();
		});	
  	});
 };
 

/**
* Connects to mongodb with mongoose. Builds and returns 
* a query string with time and id restrictions.
*/
function getQuery(callback) {
	sysLogger.info('<datalogs.getQuery> Accessing logs at ' + 'mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db);
	mongoose.connect('mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db, function(err, db) {
		if(err) { sysLogger.error('<datalogs> <getQuery> '+ err); }
		Data = mongoose.model('Data', dataSchema, config.logs.collection.prices);	
		var query = Data.where('eventId').equals(eventId)
		if(from != null) query = query.where('timestamp').gt(from)
		if(to != null) query = query.where('timestamp').lt(to)  
		callback(query);
	});
};

/**
* Removes all logs matching conditions
*/
function removeResults(callback) {
	sysLogger.info('<datalog> <removeResults> Accessing logs at ' + 'mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db);
	mongoose.connect('mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db, function(err, db) {
		if(err) { sysLogger.error('<datalogs> <removeResults> '+ err); }
		Model = mongoose.model('Data', dataSchema, config.logs.collection.prices);	
		if(from != null && to != null) 
			Model.find({})
			.where('eventId').equals(eventId)
			.where('timestamp').gt(from)
			.where('timestamp').lt(to)
			.remove();
		else if(from == null && to != null)
			Model.find({})
			.where('eventId').equals(eventId)
			.where('timestamp').lt(to)
			.remove();
		else if(from != null && to == null)
			Model.find({})
			.where('eventId').equals(eventId)
			.where('timestamp').gt(from)
			.remove();
		else if(eventId != null) 
			Model.find({})		
			.where('eventId').equals(eventId)
			.remove(function(err, numberRemoved) {
				sysLogger.info('<datalogs> <removeResults> Remove logs with eventId = ' + eventId); 
				callback(numberRemoved);		
			});	
		else { 
			Model.find({})		
			.remove(function(err, numberRemoved) {
				sysLogger.info('<datalogs> <removeResults> Removed complete history, number of lines: ' + numberRemoved); 
				callback(numberRemoved);		
			});
		}
	});
	
	
} 



/**
* Pipes the Query results to the resonse object using 
* a customized query formatter.
*/ 
function streamResults(res, callback) {
	sysLogger.info('<datalogs> <streamResults> Accessing logs at ' + 'mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db);
	var db = mongoose.connect('mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db).connection; 
	var Data = db.model('Data', dataSchema, config.logs.collection.prices);
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
* Current Date with customized format
*/
Date.prototype.fileformat = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   var hrs = this.getHours().toString();
   var min = this.getMinutes().toString();
   return yyyy 
   		+ (mm[1]?mm:"0"+mm[0]) 
   		+ (dd[1]?dd:"0"+dd[0])
   		+ '-'
   		+ (hrs[1]?hrs:"0"+hrs[0])
   		+ (min[1]?min:"0"+min[0]);
};

/**
* Returns a formatted query stream with time and id restrictions. 
* taking a db model object and a query formatter. 
*/ 
function buildQueryStream(Model, format) {
	if(from != null && to != null) 
		return Model.find({})
		.where('marketId').equals(eventId)
		.where('timestamp').gt(from)
		.where('timestamp').lt(to)
		.stream().pipe(format);
	else if(from == null && to != null)
		return Model.find({})
		.where('marketId').equals(eventId)
		.where('timestamp').lt(to)
		.stream().pipe(format);
	else if(from != null && to == null)
		return Model.find({})
		.where('marketId').equals(eventId)
		.where('timestamp').gt(from)
		.stream().pipe(format);	
	else
		return Model.find({})		
		.where('marketId').equals(eventId)		
		.stream().pipe(format);	
}


function testQuery() {
	console.log('<datalogs> <testQuery>');	
	var db = mongoose.connect('mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db).connection; 
	var Data = db.model('Data', dataSchema, 'prices');
	Data.find({}, function (err, data) {		
		if(err) { sysLogger.error('<logfactory> <streamResults> <Data.find>');} 
		console.log('<datalogs> <testQuery>');	
		console.log(data); 
	});
}

//testQuery();


 