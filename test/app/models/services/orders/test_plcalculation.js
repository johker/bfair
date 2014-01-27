/**
 * Test module for profit loss calculations
 */
var env = process.env.NODE_ENV || 'development'
	, root = '../../../../../'
	, servicedir = root + 'app/models/services/'
	, config = require(root + 'config/config')[env]
	, async = require('async')
	,  _ = require('underscore')
	, winston = require(root + 'config/winston')
	, plcalc = require(servicedir + 'orders/plcalculation');

// GLOBAL variables
sysLogger = winston.getSysLogger()

var sidBets = {
'1000000': 
   [ { betId: '10000000001',
       selectionId: '1000000',
       side: 'BACK',
       averagePriceMatched: 3,
       sizeMatched: 10},
     { betId: '10000000002',
       selectionId: '1000000',
       side: 'BACK',
       averagePriceMatched: 4,
       sizeMatched: 15},
     { betId: '10000000003',
       selectionId: '1000000',
       side: 'LAY',
       averagePriceMatched: 5,
       sizeMatched: 10},
     { betId: '10000000004',
       selectionId: '1000000',
       side: 'LAY',
       averagePriceMatched: 6,
       sizeMatched: 15}  ]
}

var sidBets2 = {
'1000000': 
   [ { betId: '10000000001',
       selectionId: '1000000',
       side: 'BACK',
       averagePriceMatched: 12,
       sizeMatched: 100},
     { betId: '10000000002',
       selectionId: '1000000',
       side: 'LAY',
       averagePriceMatched: 9,
       sizeMatched: 2},
    ]
}

var sidBets3 = {
'1000000': 
   [ { betId: '10000000001',
       selectionId: '1000000',
       side: 'BACK',
       averagePriceMatched: 12,
       sizeMatched: 100},
     { betId: '10000000002',
       selectionId: '1000000',
       side: 'LAY',
       averagePriceMatched: 9,
       sizeMatched: 2},
     { betId: '10000000003',
       selectionId: '1000000',
       side: 'LAY',
       averagePriceMatched: 6,
       sizeMatched: 2}
    ]
}

plcalc.profitLoss(sidBets3, function(err, result){ 
	console.log(result);
});

 
 
