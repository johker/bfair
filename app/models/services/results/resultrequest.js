var FeedParser = require('feedparser')
  , request = require('request')
  , root = '../../../../'
  , rtc = require(root + 'app/controllers/configcontroller')
  , su = require(root + 'util/stringutil')
  , pingcounter = 0 
  , results = []

/**
* Returns horse racing results - with about 10 mins delay
* @param cb - callback function
*/
exports.listLatestResults = function(cb){
	request(rtc.getConfig('results.baseurl'))
	  .pipe(new FeedParser({}))
	  .on('error', function(error) {
	    // always handle errors
	    sysLogger.error('<resultrequest> <listLatestResults> ' + JSON.stringify(error));
	  })
	  .on('meta', function (meta) {
	    // Boundary Marker 
	    results = [];
	  })
	  .on('readable', function() {
			var stream = this, item;
			while (item = stream.read()) {
				var result = {string: item.title, marketId: exports.parseId(item.link) , description: exports.parseTitle(item.title), winners: exports.parseWinners(item.summary)};
	        	results.push(result);
	        }
	  });
	 cb(results);
}


/**
* Splits a title into its parts
* @param title -  string of type: 'FRA / Chant (FRA) 6th Feb - 15:10 2100m 4yo+ settled'
* @return description
*/
exports.parseTitle = function(title) {
	var desc = {};
	var arr = title.split('-');	
	desc['country'] = su.trim(arr[0].substr(0,arr[0].indexOf('/')));
	desc['place'] =su.trim(arr[0].substr(arr[0].indexOf('/')+1,arr[0].indexOf('(')));
	desc['date'] = su.trim(arr[0].substr(arr[0].indexOf(')') +1, arr[0].length-1));
	desc['time'] =  su.trim(arr[1].substr(0, arr[1].indexOf(':') + 3));
	desc['type'] = su.trim(arr[1].substr(arr[1].indexOf(':') + 3, arr[1].length-1));
	return desc;
}

/**
* Adds winners to array
* @param title -  string of type: 'Winner(s): Gems A Plenty, Blazing Al, Global Talk, Dravidian'
* @return Array of Winners
*/
exports.parseWinners = function(summary) {
	var winners = [];
	var arr = summary.split(',');	
	for (var i = 0; i < arr.length; i++) {
		if(i == 0) {
			winners[0] = su.trim(arr[0].substr(arr[0].indexOf(':')+1,arr[0].length));
		} else {
		 	winners[i] = arr[i];
		} 
	}
	return winners; 
}

/**
* Adds winners to array
* @param link -  string of type: http://rss.betfair.com/Index.aspx?format=html&sportID=7&marketID=112793671'
* @return marketId
*/
exports.parseId = function(link) {
	var marketId = su.trim(link.substr(link.indexOf('marketID')+9, link.length));  
	return marketId; 
}
