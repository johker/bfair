
var root = '../../../'
 	, rtc = require(root + 'app/controllers/configcontroller')
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
	sysLogger.debug('<db_markets> <connect>');
	mongoose.connection.close( function(err) {
		if(err) {sysLogger.error('<db_markets> <closeConnection> '+  err);	}
		mongoose.connect('mongodb://' + rtc.getConfig('logs.host') + ':' + rtc.getConfig('logs.port') + '/' + rtc.getConfig('logs.db'), function(err, db) {
			if(err) { return sysLogger.error('<db_markets> <connect> '+ err); }
			HistoryModel = mongoose.model('History', HistorySchema, rtc.getConfig('logs.collection.prices'));
			sysLogger.notice('<db_markets> <connect> HistoryModel initialized');
			callback(HistoryModel); 
		});
	})		
}

	

/**
* Add market to history and emit websocket event
*/
exports.add = function(market) {	
	sysLogger.info('<db_markets> <add> market ID = ' + market.marketId);
	connect(function(Model) {
		var marketdto = {
				marketId: market.id, 
				description: market.name + ':' + market.marketName,
				passivationTime: strutil.millisToDate(market.passivationTime)
		};
		var mitem = new Model(marketdto);
		mitem.save(function (err) {
			if(err != null) {
				sysLogger.warning('<db_markets> <add> ' + err.err);		 	
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
			if(err) { sysLogger.info('<db_markets> <getList> Querying history');} 
				callback(data); 
		});
	}); 
}



/**
* Clean history. This function removes all entries of the 'prices' collection 
* 
*/
exports.removeAll = function(callback) {
	sysLogger.debug('<db_markets> <removeAll> Accessing logs at ' + 'mongodb://' + rtc.getConfig('logs.host') + ':' + rtc.getConfig('logs.port') + '/' + rtc.getConfig('logs.db'));
	connect(function(Model) {
		Model.find({})		
			.remove(function(err, numberRemoved) {
				sysLogger.info('<db_markets> <removeAll> Removed complete history, number of lines: ' + numberRemoved); 
				callback(err, numberRemoved);		
		});
		});
}

/**
* Remove docmument with specified name from 'prices' collection 
* @param {string} mid - market ID to be removed.
*/
exports.removeEntry = function(mid, callback) {
	sysLogger.debug('<db_markets> <removeEntry> Accessing logs at ' + 'mongodb://' + rtc.getConfig('logs.host') + ':' + rtc.getConfig('logs.port') + '/' + rtc.getConfig('logs.db'));
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
			sysLogger.error('<db_markets> <closeConnection> '+  err);
			sysLogger.warn('<db_markets> <closeConnection> '+ 'No Mongoose Connection: Nothing to close...');
		}
	});
}

// Test 
// exports.getList(function(data) {console.log(data);});
