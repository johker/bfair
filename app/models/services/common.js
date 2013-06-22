// This module contains functions shared by multiple tests
var util = require('util')
	, env = process.env.NODE_ENV || 'development'
	, betfair = require('betfair')
	, root = '../../../'
	, config = require(root + 'config/config')[env]


// session to use for all the invocations, should be set by test
exports.session = null;
exports.loginName = null;
exports.password = null;

/**
* login to Betfair
*/
exports.login = function(par, cb) {
    if(!cb) cb = par; // cb is first parameter
	sysLogger.debug('<sessionloader> <login> Logging in to Betfair');
    var session = exports.session;
    session.login(exports.loginName, exports.password, function(err, res) {
        if (err) {
            sysLogger.error('<sessionloader> <login> Login error', err);
        } else {
            sysLogger.notice('<sessionloader> <login> Login OK, %s secs', res.duration()/1000);
        }
        exports.loginCookie = res.responseCookie;
        cb(err, {});
    });
}
/**
* logout from Betfair
*/
exports.logout = function(par, cb) {
    if(!cb) cb = par;  // cb is first parameter    
    sysLogger.info('<sessionloader> <logout>');
    var session = exports.session;
    session.logout(function(err, res) {
        if (err) {
             sysLogger.error('<sessionloader> <logout> Logout error', err);
        } else {
            sysLogger.notice('<sessionloader> <logout> Logout OK, %s secs', res.duration()/1000);
        }
        cb(err, {});
    });
}
