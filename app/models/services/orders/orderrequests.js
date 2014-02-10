

var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
 	, config = require(root + 'config/config')[env]
	, session =  require(servicedir + 'session').Singelton.getInstance().getSession();
 
	
 
 /**
*
*/
exports.placeOrders = function(params, cb){
	if(!cb) cb = params;  // cb is first parameter   
    session.placeOrders(params, function(err,res) {    
    	cb(err,res);
    });
}

 /**
*
*/
exports.cancelOrders = function(params, cb){
	if(!cb) cb = params;  // cb is first parameter   
    session.cancelOrders(params, function(err,res) {    
    	cb(err,res);
    });
}


 /**
*
*/
exports.listCurrentOrders = function(params, cb){
	if(!cb) cb = params;  // cb is first parameter   
    session.listCurrentOrders(params, function(err,res) {    
    	cb(err,res);
    });
}

