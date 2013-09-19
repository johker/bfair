var nodemailer = require("nodemailer")
	,  mongoose = require('mongoose')
 	, env = process.env.NODE_ENV || 'development'
	, root = '../../../'
	, servicedir = root + 'app/models/services/'
	, config = require(root + 'config/config')[env]
	, request = require(servicedir + 'markets/marketrequests');





exports.marketIdLength = function(marketId, cb) {
	var err = null;
	if(marketId.length != 11) 
		err = new Error('Market ID Error');
	cb(err, marketId);
}

exports.marketStatusClosed = function(marketId, cb) {
	var err = null;
	request.listMarketBook({"marketIds":[marketId]}, function(err, res) {		
		if(res.response.result[0].status != 'OPEN') { 
			err = new Error('Market Status Error');
		}	
		cb(err, marketId);
	});
}

exports.marketEventType = function(marketId, cb) {
	var err = null;
	request.listMarketCatalogue( {"filter":{"marketIds":[marketId]},"maxResults":"1","marketProjection":["EVENT_TYPE"]}, function(err, res) {
		if(res.response.result[0].eventType.id != config.api.eventType) {
			err = new Error('Market Event Type Error');	
		}
		cb(err, marketId); 
	});
}