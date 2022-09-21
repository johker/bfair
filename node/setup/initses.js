var mongoose = require('mongoose'),
    SES = require('../app/models/db/db_ses');

// Load configurations
var rtc = require(root + 'app/controllers/configcontroller')
  , mongoose = require('mongoose')

mongoose.connect(rtc.getConfig('db'), function(err) {
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