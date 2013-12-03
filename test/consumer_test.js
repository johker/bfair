/**
 * New node file
 */
 
 var open = require('amqplib').connect('amqp://localhost')
 
 var queue = 'com.bfair.pricing.price';
 
	// Consumer
	open.then(function(conn) {
	  var ok = conn.createChannel();
	  ok = ok.then(function(ch) {
	    ch.assertQueue(queue);
	    ch.consume(queue, function(msg) {
	      if (msg !== null) {
	      	var book = JSON.parse(msg.content.toString());
	        console.log(book);
	        ch.ack(msg);
	      }
	    });
	  });
	  return ok;
	}).then(null, console.warn);