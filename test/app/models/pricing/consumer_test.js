/**
 * New node file
 */
 
 var open = require('amqplib').connect('amqp://localhost')
 
 var queue = 'com.bfair.pricing.price'
 , util = require('util')
 , EventEmitter = require('events').EventEmitter
 
 var Consumer = function Consumer(queue) { 	
 	var self = this; 
	// Consumer
	open.then(function(conn) {
	  var ok = conn.createChannel();
	  ok = ok.then(function(ch) {
	    ch.assertQueue('com.bfair.pricing.price');
	    ch.consume('com.bfair.pricing.price', function(msg) {
	      if (msg !== null) {	      				
	      	var book = JSON.parse(msg.content.toString());
	        console.log(new Date());
	        console.log(book);
	      	setData(book);
	    	 ch.ack( msg );
	      }
	    });
	  });
	  return ok;
	}).then(null, console.warn);
	
	}
	
util.inherits(Consumer, EventEmitter);

function setData(data) {
	var book = data;
	emit(book); 
}

function emit(data) {
	this.emit('rabbitsub', data);
}  


new Consumer();