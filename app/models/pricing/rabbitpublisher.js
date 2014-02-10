var amqp = require('amqplib')
	, env = process.env.NODE_ENV || 'development'
	, root = '../../../'
	, rtc = require(root + 'app/controllers/configcontroller')
	
	

var RabbitProducer = function RabbitProducer(queue) { 	
	var self = this;
	self.q = queue || rtc.getConfig('amqp.queues.defaultpub')

}

/**
* @see https://github.com/squaremo/amqp.node/issues/37
* @param data - DTO of market book
* @param type - 
*/
RabbitProducer.prototype.publish = function(data, type) {
	var self = this;
	var open = amqp.connect('amqp://localhost');
	open.then(function(conn) {
	  var ok = conn.createChannel();
	  ok = ok.then(function(ch) {
	    ch.assertQueue(self.q);
	    ch.sendToQueue(self.q, new Buffer(JSON.stringify(data)), {
	     contentType:'application/json', 
	     replyTo: rtc.getConfig('amqp.queues.consumer'),
	     headers:{ __TypeId__: type}
	    });
	    return ch.close(); // return this so it can be used to synchronise
	  });
	  // The key from your point of view is to synchronise on closing the channel, 
	  // so you will want to return the result of closing the channel, and only 
	  // close the connection once that's completed:
	  return ok.then(function() { conn.close(); });
	}).then(null, console.warn);

}




  module.exports = RabbitProducer;


