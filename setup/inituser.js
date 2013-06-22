var mongoose = require('mongoose'),
    User = require('../app/models/db/user');

// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , mongoose = require('mongoose')

mongoose.connect(config.db, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});

// clear collection
User.remove({}, function (err) {
  if (err) throw err;
});

// create a new user
var testUser = new User({
    username: 'node',
    password: 'node1'
});


// save user to database
testUser.save(function(err) {	
    if (err) throw err;

    // fetch user and test password verification
    User.findOne({ username: 'node' }, function(err, user) {
        if (err) throw err;

        // test a matching password
        user.comparePassword('node1', function(err, isMatch) {
            if (err) throw err;
            console.log('node1:', isMatch); // -> node1: true
        });

        // test a failing password
        user.comparePassword('1node', function(err, isMatch) {
            if (err) throw err;
            console.log('1node:', isMatch); // -> 1node: false
        });
    });
});