/*
 * Enables Emulation for markets 
 * 
 */

var env = process.env.NODE_ENV || 'development'
 	, root = '../../../../'
	, config = require(root + 'config/config')[env]
	, servicedir = root + 'app/models/services/'
	, session =  require(servicedir + 'session').Singelton.getInstance().getSession();
	
/**
* TODO Manage list of emulated markets. 
*/
module.exports.enable = function(id) {
	sysLogger.crit('<marketemulation> <enable> MID = ' +  id); 
	session.enableBetEmulatorForMarket(id);
} 
 
 