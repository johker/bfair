var nodemailer = require("nodemailer")
	, mongoose = require('mongoose')
 	, root = '../../../'
	, servicedir = root + 'app/models/services/'
	, rtc = require(root + 'app/controllers/configcontroller')
	, request = require(servicedir + 'markets/marketrequests');




/**
* Checks if existing market ID has correct length. 
* 
*/
exports.marketIdLength = function(marketId, cb) {
	var err = null;
	if(marketId.length != 11) {
		err = new Error('Market ID Error');
		sysLogger.critical('<checks> <marketIdLength> ID LENGTH = ' + marketId.length);
	}
	cb(err, marketId);
}

/**
* Deprecated - state not unambiguous
* DISABLED
*/
exports.marketStatusClosed = function(marketId, cb) {
	var err = null;
	cb(err, marketId);
	/*
	request.listMarketBook({"marketIds":[marketId]}, function(err, res) {		
		if(res.response.result[0].status != 'CLOSED') {
			sysLogger.critical('<checks> <marketStatusClosed> STATUS = ' + res.response.result[0].status + ' (MID = ' + marketId + ')'); 
			err = new Error('Market Status Error');
		}	
		cb(err, marketId);
	});
	*/
}

/**
* Checks if event type is correct. 
* DISABLED
*/
exports.marketEventType = function(marketId, cb) {
	var err = null;
	cb(err, marketId);
	/*
	request.listMarketCatalogue( {"filter":{"marketIds":[marketId]},"maxResults":"1","marketProjection":["EVENT_TYPE"]}, function(err, res) {
		sysLogger.critical('<checks> <marketEventType> EVENT TYPE = ' + JSON.stringify(res.response));	
		if(res.response[0].result[0].eventType.id != rtc.getConfig('api.eventType')) {
			sysLogger.critical('<checks> <marketEventType> EVENT TYPE = ' + JSON.Stringify(res.response[0].result[0].eventType.id));	
			err = new Error('Market Event Type Error');	
		}
		cb(err, marketId); 
	});
	*/
}