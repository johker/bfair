var express = require('express.io')
	, fs = require('fs')
  	, passport = require('passport')
  	, winston = require('./config/winston')
  	// socket.io setup 




// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , auth = require('./config/authorization')
  , mongoose = require('mongoose')

process.env['NODE_ENV'] = 'test';



// Bootstrap logging (global)

apiLogger = winston.getApiLogger();
sysLogger = winston.getSysLogger();

// hjljblk

// Bootstrap db connection
sysLogger.notice('<server> DB config: ' + config.db);
mongoose.connect(config.db)

// Bootstrap models
var models_path = config.root + '/app/models/db'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})

// bootstrap passport config	
require('./config/passport')(passport, config)

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
sysLogger.notice('<server> Express app started on port '+ port)



