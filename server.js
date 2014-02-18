var express = require('express.io')
	, fs = require('fs')
  	, passport = require('passport')
  	, winston = require('./config/winston')
  	// socket.io setup 
	, notifier = require('./app/models/services/notifier')
	


// Load configurations
var root = './' 
	, env = process.env.NODE_ENV || 'development'
	, config = require('./config/config')[env]
	, rtc = require(root + 'app/controllers/configcontroller')
	, auth = require('./config/authorization')
	, mongoose = require('mongoose')

process.env['NODE_ENV'] = 'development';
process.env['TZ'] = 'Europe/Amsterdam';


// Bootstrap globals
apiLogger = winston.getApiLogger();
sysLogger = winston.getSysLogger();
betfair = require('./app/models/api'); // Patched version 
sysLogger.crit('<server> System logging to ' + winston.getFile());



if(env == 'development') {
	process.on('uncaughtException', function(err) {
	  sysLogger.error('<server> <uncaught exception> ' + JSON.stringify(err));
	  //notifier.sendMail('Bfair App Crash',  err.message); 
	  console.error(err.stack);
	});
}



// Bootstrap db connection
sysLogger.notice('<server> DB config: ' + rtc.getConfig('db'));
mongoose.connect(rtc.getConfig('db'))

// Bootstrap models
var models_path = rtc.getConfig('root') + '/app/models/db'
//fs.readdirSync(models_path).forEach(function (file) {
//  require(models_path+'/'+file)
//})
require(models_path+'/accounts');
require(models_path+'/user');



// bootstrap passport config	
require('./config/passport')(passport, config);
// bootstrap error codes / Errors
require(root + 'errors/codes');




// Making app GLOBALLY accessible
app = express();
app.http().io();

// express settings
require('./config/express')(app, config, passport)

// Bootstrap routes
require('./config/routes')(app, passport, auth)
	
// Start the app by listening on <port>
var port = process.env.PORT || 3000
app.listen(port)
sysLogger.crit('<server> Express app started on port '+ port)



