	
var env = process.env.NODE_ENV || 'development'
	, betfair = require('betfair')
	, root = '../../../'
	, config = require(root + 'config/config')[env]
	, session
 
exports.login = function(user, password, callback) {
    sysLogger.debug('<sessionloader> <login> Logging in to Betfair');
    exports.getSession().login(user, password, function(err, res) {
	     if (err) {
            sysLogger.error('<sessionloader> <login> Login error', err);
        } else {
             sysLogger.notice('<sessionloader> <login> Login OK, %s secs', res.duration()/1000);
        }
	callback(err, {}); 
	});
}

exports.logout = function(callback) {
    sysLogger.info('<sessionloader> <logout>');
    exports.getSession().logout(user, password, function(err, res) {
	     if (err) {
            sysLogger.error('<sessionloader> <logout> Logout error', err);
        } else {
             sysLogger.notice('<sessionloader> <logout> Logout OK, %s secs', res.duration()/1000);
        }
	callback(err, {}); 
	});
}


exports.getSession = function() {
	sysLogger.debug('<sessionloader> <getSession> applicationkey = ' + config.betfair.applicationkey);
	if(session) return session; 
	else {
		session = betfair.newSession(config.betfair.applicationkey);
		return session;
	}   
}

