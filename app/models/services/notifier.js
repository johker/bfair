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


 
function sendMail() {	
	sysLogger.info('<notfier> <setData>');
	mongoose.connect('mongodb://' + config.logs.host + ':' + config.logs.port + '/be-fair-authentication', function(err, db) {
		if(err) { sysLogger.error('<notifier> <getQuery> '+ err); }
		var Model = mongoose.model('SES', AwsAccessSchema, 'ses');	
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
			     subject : "Befair Notification",
			     html: '<p> Hello World </p>'
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






