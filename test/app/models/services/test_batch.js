/**
 * New node file
 */

 var env = process.env.NODE_ENV || 'development'
	, root = '../../../../'
	, servicedir = root + 'app/models/services/'
	, config = require(root + 'config/config')[env]
	, async = require('async')
	, winston = require(root + 'config/winston')
 	, _ = require('underscore')
 	
 	, factory = require(servicedir + 'prices/marketfactory')
 	, batch = require(servicedir + 'batch'); 
 
  // global 
 sysLogger = winston.getSysLogger()
 
for(var i = 0; i < 31; i++) {
	batch.addMarket(new factory.Market(i));
}


console.log('Size = ' + batch.getAllMarkets().length);
console.log(batch.getAllMarkets());



//batch.addMarketId('' + 10);

for(var i = 11; i < 22; i++) {
	batch.removeMarket(new factory.Market(i));
}



//batch.removeMarketId(new factory.Market(30));

console.log('Size = ' + batch.getAllMarketIds().length);
console.log(batch.getAllMarketIds());

