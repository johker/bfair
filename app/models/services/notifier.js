var nodemailer = require("nodemailer")
	,  mongoose = require('mongoose')
 	, env = process.env.NODE_ENV || 'development'
	, root = '../../../'
	, Schema = mongoose.Schema
 	, config = require(root + 'config/config')[env]
 	, winston = require(root + 'config/winston')
 	, sysLogger = winston.getSysLogger()
 	, AwsAccessSchema = new Schema({
	    accesskey: { type: String, required: true, index: { unique: true } },
	    secretkey: { type: String, required: true }
	})
	, acckey
	, seckey
	, transport


function connect(callback) {
	sysLogger.debug('<notifier> <connect>');
	mongoose.connection.close( function(err) {
		if(err) {sysLogger.error('<notifier> <closeConnection> '+  err);	}
		mongoose.connect('mongodb://' + config.mail.host + ':' + config.mail.port + '/' + config.mail.db, function(err, db) {
			if(err) { return sysLogger.error('<notifier> <connect> '+ err); }
			NotifierModel = mongoose.model('SES', AwsAccessSchema, config.mail.collection);	
			sysLogger.notice('<notifier> <connect> NotifierModel initialized');
			callback(NotifierModel); 
		});
	})		
}



/**
* Fix for 'Trying to open unclosed connection' error.
*/
function closeConnection() {
	mongoose.connection.close( function(err) {
		if(err) { 
			sysLogger.warn('<notfier> <closeConnection> '+ 'No Mongoose Connection: Nothing to close...');
		}
	});
}


 
exports.sendMail = function(title, message) {	
	sysLogger.info('<notfier> <setData>');
	connect(function(Model) {
		Model.findOne({}, function (err, data) {		
			if(err) { sysLogger.error('<notifier> <getTransport> <Model.find>');}
			acckey = data.accesskey;
			console.log(acckey);
			seckey = data.secretkey;
			transport = nodemailer.createTransport("SES", {
				AWSAccessKeyID: acckey,
				AWSSecretKey: seckey
			});
			var mailoptions = {
				transport : transport, //pass your transport
		     	sender : config.mail.sender,
		     	to : config.mail.to,
		     	subject : title,
		     	html: '<p>' + message + '</p>'
			}
			//On sending mail
			nodemailer.sendMail(mailoptions, function(error, response){
		    if(error){
		        console.log(error);
		    }else{
		        console.log("Message sent: " + response.message);
		    }		
		    // if you don't want to use this transport object anymore, uncomment following line
		    //smtpTransport.close(); // shut down the connection pool, no more messages
		});		
		});
	});
}

// Test
//console.log('mongodb://' + config.mail.host + ':' + config.mail.port + '/' + config.mail.db); 
//exports.sendMail('Test title', 'Test message'); 



