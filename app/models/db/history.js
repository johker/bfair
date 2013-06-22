
var env = process.env.NODE_ENV || 'development'
	, root = '../../../'
 	, config = require(root + 'config/config')[env]
	, _ = require('underscore')
	, sysLogger = require(root + 'config/winston').getSysLogger()
    , mongoose = require('mongoose')
    , utils = require(root + 'util/stringutil')
    , Schema = mongoose.Schema
	, HistorySchema = new Schema({ 
		marketId: { type: Number, required: true, index: { unique: true }},
		description: { type: String, required: false },
		timestamp: { type: Date, required: true }
});



/**
* Add market to history and emit websocket event
*/
exports.add = function(market) {
	closeConnection();
	mongoose.connect('mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db, function(err, db) {
		if(err) { return sysLogger.error('<history> <add> '+ err); }
		var Model = mongoose.model('History', HistorySchema, config.logs.collection.prices);
		var mitem = new Model({
			marketId: market.marketId, 
			description: utils.getLastPathElement(market.menuPath),
			timestamp: (new Date()).toString()
		});
		mitem.save(function (err) {
			if (err) sysLogger.info('<history> <add> ' + err);
		});
	});
	var prop = config.logs.collection.prefix + market.marketId;
	app.io.broadcast('historyupdate', market);
}

/**
*
*/
exports.getList = function(callback) {
	closeConnection();
	mongoose.connect('mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db, function(err, db) {
		if(err) { return sysLogger.error('<history> <getList> '+ err); }
		var Model = mongoose.model('History', HistorySchema, config.logs.collection.prices);
		Model.find({}, function (err, data) {		
				if(err) { sysLogger.info('<history> <getList> Querying history');} 
				callback(data); 
			});
	});
}




/**
* Clean history.
*/
exports.removeAll = function(callback) {
	closeConnection();
	sysLogger.info('<history> <removeAll> Accessing logs at ' + 'mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db);
	mongoose.connect('mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db, function(err, db) {
		if(err) { sysLogger.error('<history> <removeAll> '+ err); }
		var Model = mongoose.model('History', HistorySchema, config.logs.collection.prices);
		Model.find({})		
			.remove(function(err, numberRemoved) {
				sysLogger.info('<history> <removeAll> Removing complete history, number of lines: ' + numberRemoved); 
				callback(numberRemoved);		
			});
		});
	}

/**
* Fix for 'Trying to open unclosed connection' error.
*/
function closeConnection() {
	mongoose.connection.close( function(err) {
		if(err) { 
			sysLogger.error('<datalogs> <closeConnection> '+  err);
			sysLogger.warn('<datalogs> <closeConnection> '+ 'No Mongoose Connection: Nothing to close...');
		}
	});
}