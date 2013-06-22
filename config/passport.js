var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , User = mongoose.model('User')
  , bcrypt = require('../util/bcryptlocal')
  
  
module.exports = function (passport, config) {
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
      User.findOne({ username: username }, null, null, function (error, user) {
        if (error) return done(error);
        if (!user || (user && !user.password)) return done(null, false, { message: 'Unknown user: ' + username });
        bcrypt.compare(password, user.password, function (error, result) {
          if (result === true) {
            return done(null, user);
          }
          return done(null, false, { message: 'Invalid password' });
        });
      });
    });
  }))
  }  
 