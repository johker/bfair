/**
* Common log statements
*/
var env = process.env.NODE_ENV || 'development'
	, root = '../'
	, winston = require(root + 'config/winston')
	, sysLogger = winston.getSysLogger()

 /**
* Logs relevant parameters using sysLogger . 
* @param {object} params - attributes position, req, res and err
*/
exports.serviceCall = function(params) {
	var messsage; 
	var pos = params.position || ''; 
	var req = params.req;
	var res = params.res;
	var err = params.err;
	sysLogger.debug((err ? JSON.stringify(err, null, 2) : JSON.stringify(res, null, 2)) + ' duration=' + res.duration / 1000);
}
 