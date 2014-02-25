var mongoose = require('mongoose')
	, root = '../../'
	, Account = require('../app/models/db/db_accounts');

// Load configurations
var rtc = require(root + 'app/controllers/configcontroller')
  , mongoose = require('mongoose')

mongoose.connect(rtc.getConfig('db'), function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});

// clear collection
Account.remove({}, function (err) {
  if (err) throw err;
});

var acc1 = new Account({
    bfUsername: 'nagarjuna23',
    bfPassword: '66cdd273',
    active: true,
    id: "acc01"
});

var acc2 = new Account({
    bfUsername: 'nhughes90',
    bfPassword: 'SLamano87', 
    active: false,
    id: "acc02"
});

var acc3 = new Account({
    bfUsername: 'dummy',
    bfPassword: 'dummy1', 
    active: false,
    id: "acc03"
});

acc1.save(function(err) {	
    if (err) throw err;
    console.log('Saving acc1... Success!');
});

acc2.save(function(err) {	
    if (err) throw err;
    console.log('Saving acc2... Success!');
});

acc3.save(function(err) {	
    if (err) throw err;
    console.log('Saving acc3... Success!');
});