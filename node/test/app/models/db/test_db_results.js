/**
 * New node file
 */
var root = '../../../../'
 	, rtc = require(root + 'app/controllers/configcontroller')
 	, winston = require(root + 'config/winston')
 	 , dbresults = require(root + 'app/models/db/db_results');
 	 
 // GLOBAL variables
sysLogger = winston.getSysLogger()
 	 
 	 dbresults.getList(function(data) {
 	 	console.log(data); 
 	 }); 