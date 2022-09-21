/**
 * New node file
 */
var root = '../'
, passport = require('passport')
, env = process.env.NODE_ENV || 'development'
, config = require(root + '/config/config')[env]

app = require('express.io')()
app.http().io()

// express settings
// require(root + '/config/express')(app, config, passport)



// build realtime-web app

var port = 7076;
var server = app.listen(port, function() {
	console.log('<server> Express app started on port '+ port)
});
