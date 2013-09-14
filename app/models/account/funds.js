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
        //sysLogger.debug("<funds> <getAccountFunds> err=" + err + " duration=" + res.duration()/1000);
        sysLogger.debug("<funds> <getAccountFunds> Request:%s\n", JSON.stringify(res.request, null, 2))
        sysLogger.debug("<funds> <getAccountFunds> Response:%s\n", JSON.stringify(res.response, null, 2));
        cb(err,res);
    });
}
	