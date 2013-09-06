// This module contains functions shared by multiple tests
var util = require('util')
	, env = process.env.NODE_ENV || 'development'
	, betfair = require('betfair')
	, root = '../../../'
	, config = require(root + 'config/config')[env]


module.exports.Singelton = (function () {
  var instantiated;
  function init() {
    // singleton here
    return {
      login: function (callback) {
      	var self = this;
    	self.getSession().login(self.username, self.password, function(err, res) {
	     if (err) {
           	sysLogger.error('<session> <login> Login error: ' + JSON.stringify(err));
        } else {
            sysLogger.notice('<session> <login> Login OK');
        }
		callback(err, res); 
		});
      },
      logout: function(callback) {
      	var self = this;
      	sysLogger.info('<session> <logout> Logging out');
    	self.getSession().logout(function(err, res) {
	     	if (err) {
            	sysLogger.error('<session> <logout> Logout error', err);
        	} else {
             	sysLogger.notice('<session> <logout> Logout OK, %s secs', res.duration()/1000);
        }
		callback(err, res); 
		});
      }, 
      getSession: function() {
      	var self = this;
      	sysLogger.debug('<session> <getSession> applicationkey = ' + config.betfair.applicationkey);
		if(self.session) {
			sysLogger.debug('<session> <getSession> return session instance, emulated = ' + self.session.isMarketUsingBetEmulator('1.110365959'));
			return self.session; 
		}
		else {
			sysLogger.crit('<session> <getSession> new session instance');
			self.session = betfair.newSession();
			self.session.setApplicationKeys({active: config.betfair.applicationkey, delayed: config.betfair.delayedapplicationkey})
			return self.session;
		} 
      },
	  username : config.betfair.user,
	  password : config.betfair.password
    };
  }
  return {
    getInstance: function () {
      if (!instantiated) {
        instantiated = init();
      }
      return instantiated;
    }
  };
})();
