
var root = '../'
	, history = require(root + 'app/models/db/history')

/**
* This removes the listing of finished (passivated) 
* markets which have been marked for logging.  
*/
history.removeAll(function(nr, err) {
	console.log('<history> <removeAll> Success!'); 
});  
