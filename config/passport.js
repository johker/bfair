var mongoose = require('mongoose')
	, root = '../'
	, LocalStrategy = require('passport-local').Strategy
	, User = require(root + 'app/models/db/db_users')
	, bcrypt = require('../util/bcryptlocal')
	, rtc = require(root + 'app/controllers/configcontroller')
  
  
 
  
module.exports = function (passport) {
  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })	

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user)
    })
  })
  
  
    // Set up the local passport strategy
  passport.use(new LocalStrategy(function (username, password, done) {
    process.nextTick(function () {
//    	mongoose.connect(rtc.getConfig('db'), function(err) {
	      User.findOne({ username: username }, function (error, user) {
	        if (error) {
	        	return done(error);
	        }
	        sysLogger.notice('<passport> <LocalStrategy> User = ' + user + ' username = ' + username + ' password  = ' + password);
	        if (!user || (user && !user.password)) return done(null, false, { message: 'Unknown user: ' + username });
	        bcrypt.compare(password, user.password, function (error, result) {
	          if (result === true) {
	            return done(null, user);
	          }
	          return done(null, false, { message: 'Invalid password' });
	        });
//	      });
    	});
    });
  }))
  


}  
//mongoose.connect(rtc.getConfig('db'), function(err) {
//	
//	console.log('User.findOne');
//	User.findOne({ username: 'node' }, function(error, user) {
//		console.log('return');
//		console.log(error);
//		console.log(user);
//	});
//});

 