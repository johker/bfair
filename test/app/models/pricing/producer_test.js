/**
 * New node file
 */
 
 var open = require('amqplib').connect('amqp://localhost')
  var queue = 'com.bfair.pricing.market';
 
	console.log('PUBLISH at ' + new Date());
	var self = this;
	open.then(function(conn) {
	  var ok = conn.createChannel();
	  ok = ok.then(function(ch) {
	    console.log();
	    ch.assertQueue(queue);
	    ch.sendToQueue(queue, new Buffer(JSON.stringify({"marketId":"1.110939501","runners":[{"selectionId":41364,"availableToBack":[{"price":1.23,"size":2},{"price":1.22,"size":55},{"price":1.21,"size":100}],"availableToLay":[{"price":98,"size":10}]},{"selectionId":41365,"availableToBack":[{"price":1.23,"size":2},{"price":1.22,"size":55},{"price":1.01,"size":100}],"availableToLay":[]}]})), {
	     contentType:'application/json',
	     replyTo: 'com.bfair.pricing.price',
	     headers:{ __TypeId__:'bookdto'}
	    });
	  });
	  return ok;
	}).then(null, console.warn);