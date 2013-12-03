
var root = '../../'
	, env = process.env.NODE_ENV || 'development'
	, bundle = require(root + 'config/resourcebundle')['en']
	, servicedir = root + 'app/models/services/'	
	, config = require(root + 'config/config')[env] 
  	, RabbitConsumer = require(root + 'app/models/pricing/rabbitsubscriber')
 	, executionHandler = require(servicedir + 'orders/execution')
 	
 	, priceSubscriber = new RabbitConsumer(config.amqp.queues.pricesub)
 	
 
 
 
 priceSubscriber.on('rabbitsub',function(thprice) {
 	sysLogger.crit('<executioncontroller> <priceSubscriber.on:rabbitsub>  market ID = ' + thprice.marketId);
	executionHandler.executeTheoretical(thprice, function(err, res) {
		sysLogger.crit('<executioncontroller> <priceSubscriber.on:rabbitsub> res = ' + JSON.stringify(res,null,2));
	});
});
 
