/**
 * New node file
 */
 var env = process.env.NODE_ENV || 'development'
	, root = '../../'
	, dbutil = require(root + 'util/mongoutil')
	, config = require(root + 'config/config')[env]
	, async = require('async')
	, assert = require('assert')
	, sysLogger = require(root + 'config/winston').getSysLogger()
	, history = require(root + 'app/models/db/history')


/**
* Constructs ame to remove single collection from
* DB. 
*/
function removeItem(collection, callback) {
	sysLogger.info('<clearall>  <removeItem> collection name = ' + collection.name);
	var str = config.logs.db + '.mid';	
	if(collection.name.substring(0, str.length)== str) {
		sysLogger.info('<clearall>  <removeItem>  Removing collection ' + collection.name);
		dbutil.removeCollection(collection.name.replace(config.logs.db + '.', ''), callback); 
	} 
}

			
/**
* Call this to remove all collections starting with 
* 'mid' from database config.logs.db. This includes 
* collections that havent been passivated yet.
*/
async.waterfall([removeCollections, clearHistory], function(err,res) {
	    sysLogger.notice('<clearall> Success!'); 
});

function removeCollections(callback) {
	sysLogger.info('<clearall> <removeCollections> ');
	dbutil.listCollections(function(err, collections) {
		async.forEach(collections, removeItem, function(err) {
			assert.equal(null, err);				
		});
	callback();
	});
}

function clearHistory(callback) {
	sysLogger.info('<clearall> <clearHistory> ');
	history.removeAll(function(err, numberRemoved) {
		assert.equal(null, err);	
		sysLogger.info('<clearall> <clearHistory> <history.removeAll>');
		callback();
	});	

}

//removeCollections(function(){sysLogger.info('<clearall> <removeCollections> Success!'); }); 



