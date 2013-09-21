
 // Environment modules 

var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
	, config = require(root + 'config/config')[env]
	, async = require('async')
	, winston = require(root + 'config/winston');

// GLOBAL variables
sysLogger = winston.getSysLogger()
betfair = require(root + 'app/models/api'); // Patched version 
// betfair = require('betfair'); // node module
	
// Test modules
var session = require(servicedir + 'session')
	, instance = session.Singelton.getInstance()
	, checks = require(servicedir + 'checks')
	, mid = '1.107453576';
	
	
	
// Very weird stuff
instance.login(function(err, res){
	async.waterfall([function(callback) {callback(null, '1.107453576');}, checks.marketIdLength, checks.marketStatusClosed, checks.marketEventType], function (err, mid) {
	    if(!err) console.log(mid); 
	  	 else console.log(err);
	});	
	
});