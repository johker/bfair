
var root = '../../../'
 	, rtc = require(root + 'app/controllers/configcontroller')
	, _ = require('underscore')
	, mongoose = require('mongoose')
    , utils = require(root + 'util/stringutil')
    , Schema = mongoose.Schema
    , strutil = require(root + 'util/stringutil')
    
    , Db = require('mongodb').Db
    , MongoClient = require('mongodb').MongoClient
    , Server = require('mongodb').Server
    , uniqueValidator = require('mongoose-unique-validator')
    , ResultsModel
    , winston = require(root + 'config/winston')

    , Runners = new Schema({ 
    		sid: { type: String, required: true, unique: true},
			name: String,
			potWin: Number, 
			potLoss: Number
	})    
	, ResultsSchema = new Schema({ 
		name: { type: String, required: false },
		type: { type: String, required: false },
		marketId: { type: String, required: true, unique: true},
		runners: [Runners],
		suspensionTime: { type: Date, required: true },
		orderCount: {type: Number, required: true},
		winners: [{type: String, required: false}],  
		profit: {type: Number, required: false}		
	});


// GLOBAL variables
sysLogger = winston.getSysLogger()

function connect(cb) {
	sysLogger.debug('<db_results> <connect> to mongodb://' + rtc.getConfig('logs.host') + ':' + rtc.getConfig('logs.port') + '/' + rtc.getConfig('logs.db'));
	mongoose.connection.close( function(err) {
		if(err) {sysLogger.error('<db_results> <closeConnection> '+  err);	}
		mongoose.connect('mongodb://' + rtc.getConfig('logs.host') + ':' + rtc.getConfig('logs.port') + '/' + rtc.getConfig('logs.db'), function(err, db) {
			if(err) { return sysLogger.error('<db_results> <connect> '+ err); }
			ResultsModel = mongoose.model('Results', ResultsSchema, rtc.getConfig('logs.collection.results'));
			sysLogger.notice('<db_results> <connect> ResultsModel initialized');
			cb(ResultsModel); 
		});
	})		
}

	

/**
* Add suspended markets without RSS results to database
* @param result - suspended market
*/
exports.add = function(result) {	
	sysLogger.crit('<db_results> <add> MID = ' + result.marketId);
	connect(function(Model) {
		var resultdto = {
				name: result.marketName,
				type: result.marketType,
				marketId: result.marketId,
				suspensionTime: result.suspensiontime,
				orderCount: result.orderct, 
				runners: transformRunnersToArray(result.runners),
				winners: null,  
				profit: null				
		};
		var ritem = new Model(resultdto);
		ritem.save(function (err) {
			if(err != null) {
				sysLogger.warning('<db_results> <add> ' + err);		 	
			}
			 
		});
	});			
}



function transformRunnersToArray(runners) {
	var runnerArray = [];
	for(var sid in runners) {
		if(runners.hasOwnProperty(sid)) {
			runnerArray.push(runners[sid]);
		}
	}
	sysLogger.debug('<db_results> <transformRunnersToArray> Array ' + JSON.stringify(runnerArray));
	return runnerArray;
}


/**
* Updates suspended market with results
* gained from RSS feed. 
* @param mid - Market Id of RSS Winner - query condtition
* @param totalProfit
* @param winners
* @param cb  
*/
exports.update = function(mid, totalProfit, winners, cb) {
	sysLogger.crit('<db_results> <update> total Profit = ' + totalProfit + ', winners = ' + winners);
	connect(function(Model) {
		var query = { marketId: mid };
		Model.findOneAndUpdate(query, { profit: totalProfit, winners: winners }, cb);
	});
}





/**
* Returns history of logged prices
*/
exports.getList = function(cb) {  
	connect(function(Model) {
		Model.find(function (err, data) {	
			if(err) { 
				sysLogger.err('<db_results> <getList> Error ' + err.err);
			} 
			cb(data); 
		});
	}); 
}



/**
* Clear results. This function removes all entries of the 'results' collection 
* 
*/
exports.removeAll = function(cb) {
	sysLogger.debug('<db_results> <removeAll> Accessing logs at ' + 'mongodb://' + rtc.getConfig('logs.host') + ':' + rtc.getConfig('logs.port') + '/' + rtc.getConfig('logs.db'));
	connect(function(Model) {
		Model.find({})		
			.remove(function(err, numberRemoved) {
				sysLogger.info('<db_results> <removeAll> Removed complete history, number of lines: ' + numberRemoved); 
				cb(err, numberRemoved);		
		});
		});
}

/**
* Remove docmument with specified name from 'prices' collection 
* @param {string} mid - market ID to be removed.
*/
exports.removeEntry = function(mid, cb) {
	sysLogger.debug('<db_results> <removeEntry> Accessing logs at ' + 'mongodb://' + rtc.getConfig('logs.host') + ':' + rtc.getConfig('logs.port') + '/' + rtc.getConfig('logs.db'));
	connect(function(Model) {
		Model.find({marketId : mid})		
			.remove(function(err, numberRemoved) {
				cb(err, numberRemoved);		
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

/*
// Test 
exports.removeAll(function(err, nrremoved) {
	if(err) console.log(err);
	else console.log(nrremoved);
});
*/