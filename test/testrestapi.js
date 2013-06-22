var root = '../'
	, betfair = require('betfair')
	, async = require('async')
	, session = betfair.newSession('CTQjpSLoJtFMjLnt')
	, common = require(root + 'test/common');
	
session.login('nagarjuna23','66cdd273', function(err) {
    console.log(err ? "Login OK" : "Login failed");
});


// list countries
function listEvents(data, cb) {
    if(!cb) 
        cb = data;
    
    session.listEvents({}, function(err,res) {
        console.log("listEvents err=%s duration=%s", err, res.duration/1000);
        console.log("Request:%s\n", JSON.stringify(res.request, null, 2))
        console.log("Response:%s\n", JSON.stringify(res.response, null, 2));
        cb(err,res);
    });
}

async.waterfall([common.login, listEvents, common.logout], function(err,res) {
    console.log("Done, err =",err);
    process.exit(0);
});