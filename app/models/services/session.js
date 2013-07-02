
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
        sysLogger.debug('<session> <login> Logging in to Betfair');
    	self.getSession().login(self.username, self.password, function(err, res) {
	     if (err) {
            sysLogger.error('<session> <login> Login error', err);
        } else {
             sysLogger.notice('<session> <login> Login OK, %s secs', res.duration()/1000);
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
			return self.session; 
		}
		else {
			self.session = betfair.newSession(config.betfair.applicationkey);
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
