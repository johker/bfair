var mongoose = require('mongoose')
	, root = '../'
	, Account = require('../app/models/db/db_accounts')
	, async = require('async')
	, rtc = require(root + 'app/controllers/configcontroller')
	, mongoose = require('mongoose')

	, acc1 = new Account({
	    bfUsername: 'nagarjuna23',
	    bfPassword: '66cdd273',
	    active: true,
	    id: "acc01"
	})
	, acc2 = new Account({
	    bfUsername: 'nhughes90',
	    bfPassword: 'SLamano87', 
	    active: false,
	    id: "acc02"
	})
	, acc3 = new Account({
	    bfUsername: 'dummy',
	    bfPassword: 'dummy1', 
	    active: false,
	    id: "acc03"
	});
  
mongoose.connect(rtc.getConfig('db'), function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
    
    async.waterfall([
        // Clear collection first
		function(callback) {  
			Account.remove({}, function (err) {
				if (err) return callback(err);
				 console.log('Accounts collection cleared.');
				 callback();
			 });
		 },
		// Enter accounts
		 function(callback) {
			 async.parallel([
			      function(callback) { 
			             acc1.save(function(err) {	
			            	 if (err) return callback(err);
			                 console.log('Saving acc1... Success!');
			                 callback();
			             });
			       },
			       function(callback) { 
			            acc2.save(function(err) {	
			            	if (err) return callback(err);
			                 console.log('Saving acc2... Success!');
			                 callback();
			            });
			       },
			       function(callback) { 
			            acc3.save(function(err) {	
			            	if (err) return callback(err);
			                console.log('Saving acc3... Success!');
			                callback();
			            });
			       }
			 ], function(err) { 
			        console.log('Accounts have been saved');
			 });
		 }
    ], function(err) { 
    	 console.log('Accounts collection: complete');
    });
    
    
});