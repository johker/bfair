
var root = '../../../'
 , servicedir = root + 'app/models/services/'
 , rtc = require(root + 'app/controllers/configcontroller')
 , amqp = require('amqp') 
 , util = require('util')
 , bookutil = require(servicedir + 'book')
 , EventEmitter = require('events').EventEmitter
 , connection = amqp.createConnection({ host: 'localhost' }) 
 , async = require('async')
 , updtct = 0
 , exchange
 , RabbitProducer = require(root + 'app/models/pricing/rabbitpublisher')
 , marketPublisher = new RabbitProducer(rtc.getConfig('amqp.queues.marketpub'))
 , executioncontroller = require(root + 'app/controllers/executioncontroller');


var RabbitConnector = function RabbitConnector() { 	
	var self = this;
}	
 	

	
RabbitConnector.prototype.marketDataUpdate = function(books) {
	var self = this;
     async.forEach(books, self.sendMarket, function(err) {	
		if (err) return next(err);		
	      sysLogger.debug('<RabbitConnector.prototype.marketDataUpdate> Updated ' + books.length + ' books');
	});
	updtct++; 
}

RabbitConnector.prototype.sendMarket = function(book) {
	if(book.marketId == rtc.getConfig('api.lockedMarketId')){
		sysLogger.debug('<RabbitConnector.prototype.sendMarket> Published Market Update: ' + book.marketId);
		marketPublisher.publish(bookutil.getDataTransferObject(book), 'bookdto')	
	}
}

RabbitConnector.prototype.sendIdCluster = function(idCluster) {
	// TODO
	//marketPublisher.publish('', 'idclusterdto')	
}


module.exports = RabbitConnector;
 
 