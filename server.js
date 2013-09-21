var express = require('express.io')
	, fs = require('fs')
  	, passport = require('passport')
  	, winston = require('./config/winston')
  	// socket.io setup 
	, notifier = require('./app/models/services/notifier')
	


// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , auth = require('./config/authorization')
  , mongoose = require('mongoose')

process.env['NODE_ENV'] = 'development';

// Bootstrap globals
apiLogger = winston.getApiLogger();
sysLogger = winston.getSysLogger();
betfair = require('./app/models/api'); // Patched version 

if(env == 'development') {
	process.on('uncaughtException', function(err) {
	  sysLogger.crit('<server> <uncaught exception>');
	  //notifier.sendMail('Bfair App Crash',  err.message); 
	  console.error(err.stack);
	});
}


// Bootstrap db connection
sysLogger.notice('<server> DB config: ' + config.db);
mongoose.connect(config.db)

// Bootstrap models
var models_path = config.root + '/app/models/db'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})

// bootstrap passport config	
require('./config/passport')(passport, config);

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



