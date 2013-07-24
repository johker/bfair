/**
 * Native DB operation support
 */
 
 var env = process.env.NODE_ENV || 'development'
	, root = '../'
	, mongodb = require("mongodb")
 	, config = require(root + 'config/config')[env]
    , Db = mongodb.Db
    , MongoClient = require('mongodb').MongoClient
    , Server = require('mongodb').Server
    , assert = require('assert')
    
 sysLogger = require(root + 'config/winston').getSysLogger()
 
/**
 * Removes the collection with the given name from logs db. 
 * @param {string} collection to be removed
 */
exports.removeCollection = function(collection) {
	sysLogger.notice('Removing collection named ' + collection); 	
	var db = new Db(config.logs.db, new Server(config.logs.host, config.logs.port));
	// Establish connection to db
	db.open(function(err, db) {
	  assert.equal(null, err);
	  
	  // Execute ping against the server
	  db.command({ping:1}, function(err, result) {
	    assert.equal(null, err);
	
	        // Drop the collection from this world
	        db.dropCollection(collection, function(err, result) {
	        	if (err) console.log(err); 
	          //assert.equal(null, err);
	
	          // Verify that the collection is gone
	          db.collectionNames(collection, function(err, names) {
	            //assert.equal(0, names.length);			
	            db.close();
	      });
	    });
	  });
	});
} 


/**
* Lists all collections for the given database.
* @param {string} database name
*/ 
exports.listCollections = function(dbname, callback) {
	var db = dbname || config.logs.db; 
	var db_connector = new Db(db, new Server(config.logs.host, config.logs.port));
	db_connector.open(function(err, db){
	    db.collectionNames(function(err, collections){
	        callback(err, collections);
	    });
});
}






