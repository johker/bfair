var mongoose = require('mongoose')
	, root = '../'
	, Account = require('../app/models/db/db_accounts')
	, async = require('async')
	, rtc = require(root + 'app/controllers/configcontroller')
	, mongoose = require('mongoose')
	, winston = require(root + 'config/winston')
	, sysLogger = winston.getSysLogger()

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
    sysLogger.critical('Successfully connected to MongoDB');
    
    async.waterfall([
        // Clear collection first
		function(callback) {  
			Account.remove({}, function (err) {
				if (err) return callback(err);
				sysLogger.critical('Accounts collection cleared.');
				 callback();
			 });
		 },
		// Enter accounts
		 function(callback) {
			 async.parallel([
			      function(callback) { 
			             acc1.save(function(err) {	
			            	 if (err) return callback(err);
			            	 sysLogger.critical('Saving acc1... Success!');
			                 callback();
			             });
			       },
			       function(callback) { 
			            acc2.save(function(err) {	
			            	if (err) return callback(err);
			            	sysLogger.critical('Saving acc2... Success!');
			                 callback();
			            });
			       },
			       function(callback) { 
			            acc3.save(function(err) {	
			            	if (err) return callback(err);
			            	sysLogger.critical('Saving acc3... Success!');
			                callback();
			            });
			       }
			 ], function(err) { 
				 sysLogger.critical('Accounts have been saved');
			 });
		 }
    ], function(err) { 
    	sysLogger.critical('Accounts collection: complete');
    	 var code = 0; 
     	if(err) {
     		code = 1;
     	} 
     	sysLogger.critical('Status = ' + code);
     	sysLogger.critical('User collection: complete');
     	process.exit(code);
    	 
    });
    
    
});