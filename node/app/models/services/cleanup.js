
var root = '../../../'
	, dbresults = require(root + 'app/models/db/db_results')
	, rtc = require(root + 'app/controllers/configcontroller')
	, schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
rule.minute = rtc.getConfig('cron.cleanup.minute');
rule.hour = rtc.getConfig('cron.cleanup.hour');


exports.startCleanupScheduler = function() {
	var j = schedule.scheduleJob(rule, function() {
		 dbresults.removeAll(function(err, nrremoved) {
			if(err) {
				sysLogger.error('<cleanup> ' + JSON.stringify(err));
			} else {
				sysLogger.critical('<cleanup> ' + nrremoved + ' results removed from db.');
			}
		});
	});
}