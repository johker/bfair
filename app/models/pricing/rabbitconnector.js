
var env = process.env.NODE_ENV || 'development'
 , root = '../../../'
 , servicedir = root + 'app/models/services/'
 , config = require(root + 'config/config')[env]
 , amqp = require('amqp') 
 , util = require('util')
 , bookutil = require(servicedir + 'book')
 , EventEmitter = require('events').EventEmitter
 , connection = amqp.createConnection({ host: 'localhost' }) 
 , async = require('async')
 , updtct = 0
 , exchange
 , RabbitProducer = require(root + 'app/models/pricing/rabbitpublisher')
 , marketPublisher = new RabbitProducer(config.amqp.queues.marketpub)
 , executioncontroller = require(root + 'app/controllers/executioncontroller');


var RabbitConnector = function RabbitConnector() { 	
	var self = this;
}	
 	

	
RabbitConnector.prototype.marketDataUpdate = function(books) {
	sysLogger.debug('<RabbitConnector.prototype.marketDataUpdate> ');
	var self = this;
     async.forEach(books, self.sendMarket, function(err) {	
		if (err) return next(err);		
	      sysLogger.debug('<RabbitConnector.prototype.marketDataUpdate> Updated ' + books.length + ' books');
	});
	updtct++; 
}

RabbitConnector.prototype.sendMarket = function(book) {
	if(book.marketId == config.api.testMarketId){
		sysLogger.debug('<RabbitConnector.prototype.sendMarket> Published Market Update: ' + book.marketId);
		marketPublisher.publish(bookutil.getDataTransferObject(book), 'bookdto')	
	}
}

RabbitConnector.prototype.sendIdCluster = function(idCluster) {
	// TODO
	//marketPublisher.publish('', 'idclusterdto')	
}


module.exports = RabbitConnector;
 
 