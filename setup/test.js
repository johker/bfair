/**
 * New node file
 */
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');

var db = new Db('be-fair-logs', new Server('127.0.0.1', 27017));
// Establish connection to db
db.open(function(err, db) {
  assert.equal(null, err);
  
  // Execute ping against the server
  db.command({ping:1}, function(err, result) {
    assert.equal(null, err);

        // Drop the collection from this world
        db.dropCollection("mid1.110102414", function(err, result) {
          assert.equal(null, err);

          // Verify that the collection is gone
          db.collectionNames("mid1.110102414", function(err, names) {
            assert.equal(0, names.length);			
            db.close();
      });
    });
  });
});