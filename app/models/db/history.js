
var env = process.env.NODE_ENV || 'development'
	, root = '../../../'
 	, config = require(root + 'config/config')[env]
	, _ = require('underscore')
	, sysLogger = require(root + 'config/winston').getSysLogger()
    , mongoose = require('mongoose')
    , utils = require(root + 'util/stringutil')
    , Schema = mongoose.Schema
    , strutil = require(root + 'util/stringutil')
    
    , Db = require('mongodb').Db
    , MongoClient = require('mongodb').MongoClient
    , Server = require('mongodb').Server
    , uniqueValidator = require('mongoose-unique-validator')
    , HistoryModel
    
	, HistorySchema = new Schema({ 
		description: { type: String, required: false },
		marketId: { type: Number, required: true, unique: true},
		passivationTime: { type: Date, required: true }
	});



function connect(callback) {
	sysLogger.debug('<history> <connect>');
	mongoose.connection.close( function(err) {
		if(err) {sysLogger.error('<history> <closeConnection> '+  err);	}
		mongoose.connect('mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db, function(err, db) {
			if(err) { return sysLogger.error('<history> <connect> '+ err); }
			HistoryModel = mongoose.model('History', HistorySchema, config.logs.collection.prices);
			sysLogger.notice('<history> <connect> HistoryModel initialized');
			callback(HistoryModel); 
		});
	})		
}

	

/**
* Add market to history and emit websocket event
*/
exports.add = function(market) {	
	sysLogger.info('<history> <add> market ID = ' + market.marketId);
	connect(function(Model) {
		var marketdto = {
				marketId: market.id, 
				description: market.name + ':' + market.marketName,
				passivationTime: strutil.millisToDate(market.passivationTime)
		};
		var mitem = new Model(marketdto);
		mitem.save(function (err) {
			if(err != null) {
				sysLogger.warning('<history> <add> ' + err.err);		 	
			} else {
				app.io.broadcast('newpmarket', marketdto);
			}
		});
	});			
}

/**
* Returns history of logged prices
*/
exports.getList = function(callback) {  
	connect(function(Model) {
		Model.find({}, function (err, data) {	
			if(err) { sysLogger.info('<history> <getList> Querying history');} 
				callback(data); 
		});
	}); 
}



/**
* Clean history. This function removes all entries of the 'prices' collection 
* 
*/
exports.removeAll = function(callback) {
	sysLogger.debug('<history> <removeAll> Accessing logs at ' + 'mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db);
	connect(function(Model) {
		Model.find({})		
			.remove(function(err, numberRemoved) {
				sysLogger.info('<history> <removeAll> Removed complete history, number of lines: ' + numberRemoved); 
				callback(err, numberRemoved);		
		});
		});
}

/**
* Remove docmument with specified name from 'prices' collection 
* @param {string} mid - market ID to be removed.
*/
exports.removeEntry = function(mid, callback) {
	sysLogger.debug('<history> <removeEntry> Accessing logs at ' + 'mongodb://' + config.logs.host + ':' + config.logs.port + '/' + config.logs.db);
	connect(function(Model) {
		Model.find({marketId : mid})		
			.remove(function(err, numberRemoved) {
				callback(err, numberRemoved);		
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

// Test 
// exports.getList(function(data) {console.log(data);});
