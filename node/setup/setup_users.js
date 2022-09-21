var mongoose = require('mongoose')
	, root = '../'
    , User = require('../app/models/db/db_users')
    , async = require('async')
	, rtc = require(root + 'app/controllers/configcontroller')
	, winston = require(root + 'config/winston')
	, sysLogger = winston.getSysLogger()
	
	
	, testUser = new User({
	    username: 'node',
	    password: 'node1'
	});
	
mongoose.connect(rtc.getConfig('db'), function(err) {
    if (err) throw err;
    sysLogger.critical('Successfully connected to ' + rtc.getConfig('db'));
    
    async.waterfall([
	  function(callback) {
		  // clear collection
		  User.remove({}, function (err) {
			 if (err) return callback(err);
			 sysLogger.critical('User collection cleared.');
		    callback()
		  });
      }, 
      // save user to database
  	  function(callback) { 
    	testUser.save(function(err) {	
    		if (err) return callback(err);
    		sysLogger.critical('Saving test user ... Success!');
    		callback();
    	});
     },
     // Test matching password
     function(callback) { 
    	// fetch user and test password verification
    	User.findOne({ username: 'node' }, function(err, user) {
    		if (err) return callback(err);
    	   // test a matching password
           user.comparePassword('node1', function(err, isMatch) {
        	   if (err) return callback(err);
        	   sysLogger.info('node1:', isMatch); // -> node1: true
               callback();
           });
    	});     	
     },
     // Crosscheck test user pw
     function(callback) { 
    	// fetch user and test password verification
    	User.findOne({ username: 'node' }, function(err, user) {
    		if (err) return callback(err);
    	    // test a failing password
            user.comparePassword('1node', function(err, isMatch) {
            	if (err) return callback(err);
            	sysLogger.info('1node:', isMatch); // -> 1node: false
                callback();
            });
    	});
     }
	], function(err) {
    	var code = 0; 
    	if(err) {
    		code = 1;
    	} 
    	sysLogger.critical('Status = ' + code);
    	sysLogger.critical('User collection: complete');
    	process.exit(code);
   });
});





