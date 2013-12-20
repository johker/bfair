
var root = '../../'
	, bundle = require(root + 'config/resourcebundle')['en']
	, servicedir = root + 'app/models/services/'	
	, rtc = require(root + 'app/controllers/configcontroller')
  	, RabbitConsumer = require(root + 'app/models/pricing/rabbitsubscriber')
 	, executionHandler = require(servicedir + 'orders/execution')
 	
 	, priceSubscriber = new RabbitConsumer(rtc.getConfig('amqp.queues.pricesub'))
 	, OrderObserver = require(servicedir + 'orders/orderobserver')
	, orderobserver = new OrderObserver()
 
 
 
 priceSubscriber.on('rabbitsub',function(theoretical) {
 	orderobserver.add(theoretical);
 	executionHandler.executeTheoretical(theoretical, function(err, res) {
		sysLogger.debug('<executioncontroller> <priceSubscriber.on:rabbitsub>');
		orderobserver.updateCurrentOrderInformation(theoretical.marketId);
	});
});
 
