
var root = '../../'
	, async = require('async')
	, bundle = require(root + 'config/resourcebundle')['en']
	, servicedir = root + 'app/models/services/'	
	, rtc = require(root + 'app/controllers/configcontroller')
  	, RabbitConsumer = require(root + 'app/models/pricing/rabbitsubscriber')
 	, executionHandler = require(servicedir + 'orders/execution')
 	
 	, priceSubscriber = new RabbitConsumer(rtc.getConfig('amqp.queues.pricesub'))
 	, OrderObserver = require(servicedir + 'orders/orderobserver')
	, orderobserver = new OrderObserver()
 
 
 /**
 * Handles amqp consumed theoreticals: Executes resulting orders and updates
 * current order information
 */
 priceSubscriber.on('rabbitsub',function(theoretical) {
 	sysLogger.crit('<executioncontroller> <priceSubscriber> New rabbitsub Event - Theoretical Market ID = ' + theoretical.marketId);
 	//How the err works is simple, when you supply anything that evaluates to true as the first argument 
 	//of the callback function waterfall will stop and call the main callback. 	
 	async.waterfall([
        // Updates list of available theoreticals
        function(callback) {
        	sysLogger.debug('<executioncontroller> <updateTheoreticals>');
 	        orderobserver.updateTheoreticals(theoretical, function(err) {
            	if (err) return callback(err);
            	callback(null);
            });
        },
        // Perform execution on theoretical
        function(callback) {
            sysLogger.debug('<executioncontroller> <executeTheoretical>');
            executionHandler.executeTheoretical(theoretical, function(err, res) {
            	 if (err) return callback(err);
            	 callback(null, theoretical);
            });
        },
        // Update listings of current orders
        function(theoretical, callback) {
        	sysLogger.debug('<executioncontroller> <updateCurrentOrderInformation>');
            orderobserver.updateCurrentOrderInformation(theoretical.marketId, true, function(err, sidBets) {
				if (err) return callback(err);
            	callback(null, sidBets);
			});
        },
        // Calculate resulting p/l and liabilities
        function(sidBets, callback) {
            sysLogger.debug('<executioncontroller> <updateProfitLoss>');
            orderobserver.updateProfitLoss(sidBets, true, function(err, sidMappedPL) {
            	if (err) return callback(err);
            	callback(null);
            });
        },
    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) {
        	sysLogger.error('<executioncontroller> <priceSubscriber.on:rabbitsub> Error during processing theoretical');
        	throw err;
        }
    }); 
});
 
