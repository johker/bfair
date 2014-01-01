var open = require('amqplib').connect('amqp://localhost')
	, env = process.env.NODE_ENV || 'development'
	, root = '../../../'
	, rtc = require(root + 'app/controllers/configcontroller')
	
	

var RabbitProducer = function RabbitProducer(queue) { 	
	var self = this;
	self.q = queue || rtc.getConfig('amqp.queues.defaultpub')

}

RabbitProducer.prototype.publish = function(data, type) {
	var self = this;
	open.then(function(conn) {
	  var ok = conn.createChannel();
	  ok = ok.then(function(ch) {
	    ch.assertQueue(self.q);
	    ch.sendToQueue(self.q, new Buffer(JSON.stringify(data)), {
	     contentType:'application/json', 
	     replyTo: rtc.getConfig('amqp.queues.consumer'),
	     headers:{ __TypeId__: type}
	    });
	  });
	  return ok;
	}).then(null, console.warn);

}


  module.exports = RabbitProducer;


