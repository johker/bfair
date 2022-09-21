var amqp = require('amqplib')
	, open = amqp.connect('amqp://localhost')
	, root = '../../../'
	, rtc = require(root + 'app/controllers/configcontroller')
	, util = require('util')
	, EventEmitter = require('events').EventEmitter




var RabbitConsumer = function RabbitConsumer(queue) { 	
	var self = this;
	self.q = queue || rtc.getConfig('amqp.queues.defaultsub')
	open = amqp.connect('amqp://localhost')
	// Consumer
	open.then(function(conn) {
	  var ok = conn.createChannel();
	  ok = ok.then(function(ch) {
	    ch.assertQueue(self.q);
	    ch.consume(self.q, function(msg) {
	      if (msg !== null) {
	        var data = JSON.parse(msg.content.toString());
	       	self.emit('rabbitsub', data);
	        ch.ack(msg);
	      }
	    });
	  });
	  return ok;
	}).then(null, console.warn);
	 
}


util.inherits(RabbitConsumer, EventEmitter);

module.exports = RabbitConsumer;


