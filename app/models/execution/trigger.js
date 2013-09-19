 var env = process.env.NODE_ENV || 'development'
	, root = '../../../'
	, servicedir = root + 'app/models/services/'
 	, config = require(root + 'config/config')[env]
	, session =  require(servicedir + 'session').Singelton.getInstance().getSession()
	, orders = require(root + 'app/models/execution/orders');
 


var offset = 0;
var activeMarkets = []; 



exports.updateTheoreticalPrice = function(marketId, price) {

}
 
exports.addMarket = function(marketId) {
	if(activeMarkets.indexOf(marketId) == -1) {
		activeMarkets.push(marketId);
		console.log(marketId);
	}
}

 
 
 
 
 
 