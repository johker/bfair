

var env = process.env.NODE_ENV || 'development'
	, root = '../../../'
	, servicedir = root + 'app/models/services/'
 	, config = require(root + 'config/config')[env]
	, session =  require(servicedir + 'session').Singelton.getInstance().getSession();
 
	
 
 /**
*
*/
exports.placeOrders = function(params, cb){
	if(!cb) cb = params;  // cb is first parameter   
    session.placeOrders(params, function(err,res) {    
    	if(err) sysLogger.error('<orders> <placeOrders> code = ' + err.code + ', message = ' + err.message);
        sysLogger.debug("<orders> <placeOrders> err=" +  err + " duration= " + res.duration/1000);
        sysLogger.debug("<orders> <placeOrders> Request:%s\n", JSON.stringify(res.request, null, 2))
        sysLogger.debug("<orders> <placeOrders> Response:%s\n", JSON.stringify(res.response, null, 2));
        cb(err,res);
    });
}


 /**
*
*/
exports.listCurrentOrders = function(params, cb){
	if(!cb) cb = params;  // cb is first parameter   
    session.listCurrentOrders(params, function(err,res) {    
    	if(err) sysLogger.error('<orders> <placeOrders> code = ' + err.code + ', message = ' + err.message);
        sysLogger.debug("<orders> <listCurrentOrders> err=" +  err + " duration= " + res.duration/1000);
        sysLogger.debug("<orders> <listCurrentOrders> Request:%s\n", JSON.stringify(res.request, null, 2))
        sysLogger.debug("<orders> <listCurrentOrders> Response:%s\n", JSON.stringify(res.response, null, 2));
        cb(err,res);
    });
}