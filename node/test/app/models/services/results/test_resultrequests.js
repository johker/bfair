// Environment modules 

var env = process.env.NODE_ENV || 'development'
	, root = '../../../../../'
	, servicedir = root + 'app/models/services/'
	, config = require(root + 'config/config')[env]
	, resultrequest = require(servicedir + 'results/resultrequest')
	
	
	
	
	
var tc1 = 'RSA / Vaal (RSA) 6th Feb - 10:35 R1 1000m Plt settled';
var tc2 = 'FRA / Chant (FRA) 6th Feb - 14:05 2700m Hcap settled';

var tc3 = 'Winner(s): Gems A Plenty, Blazing Al, Global Talk, Dravidian';
var tc4 = 'Winner(s): Blazing Al';


//console.log(resultrequest.parseTitle(tc1));
//console.log(resultrequest.parseTitle(tc2));

//console.log(resultrequest.parseWinners(tc3));
//console.log(resultrequest.parseWinners(tc4));


resultrequest.listLatestResults(function(results) {
	console.log(results);
});


