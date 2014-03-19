/**
 * New node file
 */
var env = process.env.NODE_ENV || 'development'
	, root = '../../../'
	, servicedir = root + 'app/models/services/'
 	, config = require(root + 'config/config')[env]
	, _ = require('underscore')
	, session =  require(servicedir + 'session').Singelton.getInstance().getSession();
	
	
/**
* Get available to bet amount.
*/
exports.getAccountFunds = function(cb)  {
	if(!cb) cb = filter;  // cb is first parameter    
    session.getDeveloperAppKeys(function(err,res) {
    	if(err) sysLogger.error('<funds> <getAccountFunds>' + err)
        cb(err,res);
    });
}
	