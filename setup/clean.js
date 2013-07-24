
var env = process.env.NODE_ENV || 'development'
	, root = '../'
 	, config = require(root + 'config/config')[env]
	, history = require(root + 'app/models/db/history')
	, dbutil = require(root + 'util/mongoutil')

 sysLogger = require(root + 'config/winston').getSysLogger()
	

/**
* This removes the listing of finished (passivated) 
* markets which have been marked for logging.  
*/
exports.removePassiveList = function() {
	history.removeAll(function(data, err) {
			sysLogger.notice('<history> <removeAll> Success!'); 
		});  
}  

/**
* Removes all collections that start with
* the prefix parameter from db. Removes ids from passive
* list ('price' collection) accordingly. 
* @param {string} prefix - prefix of collection name to delete
* @param {string} db - database name
*/
exports.removePrices = function(prefix, dbname) {
	var str = prefix || config.logs.db + '.mid';	
	var db = dbname || config.logs.db; 
	sysLogger.debug('<clean> <removePrices> Prefix = ' + str);
	sysLogger.debug('<clean> <removePrices> DB name = ' + db);
	dbutil.listCollections(db, function(err, collections) {
		for(var idx = 0; idx < collections.length; idx++) {
			if(collections[idx].name.substring(0, str.length)== str) {
				dbutil.removeCollection(collections[idx].name.replace(db + '.', '')); 
			}	
		}
	});
	history.removeAll(function(err, numberRemoved) {
		sysLogger.notice('<clean> <removeAll> ' + numberRemoved + ' entry successfully removed.');
	}); 
}

/** 
* Deletes single entry from history by removing 
* it from passive list and its collection from db.
*  @param {string} mid - market ID to be removed.
*/
exports.removeEntry =  function(mid) {
	sysLogger.debug('<clean> <removeEntry> mid = ' + mid);
	dbutil.removeCollection('mid' + mid);
	history.removeEntry(mid, function(err, numberRemoved) {
		sysLogger.debug('<clean> <removeEntry> ' + numberRemoved + ' entry successfully removed.');
	}); 
	
}

/**
* Clears collections containing markets that have not been recorded completely. 
* They are recongnized by its suffix.
* TODO
*/
exports.removeIncomplete = function(callback) {

}

