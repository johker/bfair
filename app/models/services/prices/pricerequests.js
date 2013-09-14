var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
 	, config = require(root + 'config/config')[env]
	, session =  require(servicedir + 'session').Singelton.getInstance().getSession();
 
 
/**
* Returns a list of dynamic data about markets. Dynamic data includes prices, the status of the market, 
* the status of selections, the traded volume, and the status of any orders you have placed in the market.
*/
exports.listMarketBook = function(params, cb){
	if(!cb) cb = params;  // cb is first parameter   
    session.listMarketBook(params, function(err,res) {    
    	if(err) sysLogger.error('<pricerequests> <listMarketBook> code = ' + err.code + ', message = ' + err.message);
        //sysLogger.debug("<pricerequests> <listMarketBook> err=" +  err + " duration= " + res.duration/1000);
        sysLogger.debug("<pricerequests> <listMarketBook> Request:%s\n", JSON.stringify(res.request, null, 2))
        sysLogger.debug("<pricerequests> <listMarketBook> Response:%s\n", JSON.stringify(res.response, null, 2));
        cb(err,res);
    });
}

 
function rest_getMarketsPrices() {

	
}

