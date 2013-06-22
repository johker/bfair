var mongoose = require('mongoose'),
    SES = require('../app/models/db/ses');

// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , mongoose = require('mongoose')

mongoose.connect(config.db, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});



// create a new user
var sescredentials = new SES({
    accesskey: 'AKIAJWTLOAGAHHPXSSBQ',
    secretkey: '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'
});


// save user to database
sescredentials.save(function(err) {	
    if (err) throw err;
	console.log('SES credentials saved');
});