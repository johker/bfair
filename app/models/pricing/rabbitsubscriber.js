var open = require('amqplib').connect('amqp://localhost')
	, env = process.env.NODE_ENV || 'development'
	, root = '../../../'
	, config = require(root + 'config/config')[env]
	, util = require('util')
	, EventEmitter = require('events').EventEmitter




var RabbitConsumer = function RabbitConsumer(queue) { 	
	var self = this;
	self.q = queue || config.amqp.queues.defaultsub
		
	// Consumer
	open.then(function(conn) {
	  var ok = conn.createChannel();
	  ok = ok.then(function(ch) {
	    ch.assertQueue(self.q);
	    ch.consume(self.q, function(msg) {
	      if (msg !== null) {
	      	var data = JSON.parse(msg.content.toString());
	      	sysLogger.debug('<rabbitsubscriber> data = ' + JSON.stringify(data));
	        self.emit('rabbitsub' , data);
	        ch.ack(msg);
	      }
	    });
	  });
	  return ok;
	}).then(null, console.warn);
	
}


util.inherits(RabbitConsumer, EventEmitter);

module.exports = RabbitConsumer;


