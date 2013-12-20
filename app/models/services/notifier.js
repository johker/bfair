var nodemailer = require("nodemailer")
	,  mongoose = require('mongoose')
 	, root = '../../../'
	, Schema = mongoose.Schema
 	, rtc = require(root + 'app/controllers/configcontroller')
 	, winston = require(root + 'config/winston')
 	, sysLogger = winston.getSysLogger()
 	, NotifierModel
 	
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
		mongoose.connect('mongodb://' + rtc.getConfig('mail.host') + ':' + rtc.getConfig('mail.port') + '/' + rtc.getConfig('mail.db'), function(err, db) {
			if(err) { return sysLogger.error('<notifier> <connect> '+ err); }
			NotifierModel = mongoose.model('mySES', AwsAccessSchema, rtc.getConfig('mail.collection'));	
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
		     	sender : rtc.getConfig('mail.sender'),
		     	to : rtc.getConfig('mail.to'),
		     	subject : title,
		     	html: '<p>' + message + '</p>'
			}
			//On sending mail
			nodemailer.sendMail(mailoptions, function(error, response){
		    if(error){
		        sysLogger.info('<notifier> ' +error);
		    }else{
		        sysLogger.info("<notifier> Message sent: " + response.message);
		    }		
		    // if you don't want to use this transport object anymore, uncomment following line
		    //smtpTransport.close(); // shut down the connection pool, no more messages
		});		
		});
	});
}

// Test
//console.log('mongodb://' + rtc.getConfig('mail.host') + ':' + rtc.getConfig('mail.port') + '/' + rtc.getConfig('mail.db')); 
//exports.sendMail('Test title', 'Test message'); 



