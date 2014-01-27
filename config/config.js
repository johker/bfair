module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      filetype: '.csv',
      timezoneShiftGMT: 1,
      mock: {
      	useprices: false,
      	usemarkets: false
      },
      mail: {
      	collection: 'ses',
      	host: 'localhost',
      	port: '27017',
      	db: 'be-fair-authentication',
      	sender : 'befairsystem@gmail.com',
      	to : 'johannes.kern@zoho.com'    
      },
      betfair: {
      	applicationkey: '2ku5TzXl34zUU1Qz', 
      	delayedapplicationkey: 'ubs5643lFSkMGKrb',
      	user: 'nhughes90', 
      	password: 'Stefano87', 
      },      
      app: {
        name: 'Nodejs Express Mongoose Demo'
      },
      db: 'mongodb://localhost:27017/be-fair-authentication',
      logs: {
      	syslogfile: '/syslog/debug.log',
      	host: 'localhost',
      	port: '27017',
      	db: 'be-fair-logs',
      	collection: {      	  
      	 	prices: 'prices',    // Logged prices of selected market IDs, DEPRECATED
      	 	prefix: 'mid'
      	 },
      	level: 'warning'		 // debug: 0,  info: 1,  notice: 2,  warning: 3,  error: 4,  crit: 5,  alert: 6,  emerg: 7
      }, 
      api: {
      	marketName: 'Wettquoten',
      	emulated: true,
      	defaultsettings: {
      		handicap: '0',
      		persistenceType: 'LAPSE',
      		orderType: 'LIMIT'
      	},
      	baseto: {
      		market: 10000, 	// Timeout for market requests
      		price: 300    // Basic Timeout price requests
      	},
      	throttle: {
      		fac1: 10,
      		fac2: 5,
      		fac3: 2, 
      		fac4: 1, 
      		th1: 1000,
      		th2: 10000, 
      		th3: 100000,
      		thupdt: 10 
      	}, 
      	batch: {
      		size: 10,
      		max: 10
      	},
      	trigger: {
      		tmThreshold: 1000
      	},
      	removeBuffer: 10,
      	eventType: '7',
      	lockedMarketId: '1.112408778',
      	lockedEventId:'27127974',
      	lockedSelectionId:'2792426',
      	applyLock: false,
      	marketPassivation: true, 
      	maxResults: '100',    
      	filter: {
		    maxEvIdx: {
			  	tennis: 7,
			   	soccer: 10
		    },      		
		    afterStDateBiasHrs: 0,  
		    afterStDateBiasMin: 10,
		    beforeStDateBiasHrs: 0,
		    beforeStDateBiasMin: 30,		    
		    minMarketCt: 0,
		    applyAfterStDate: true,
		    applyBeforeStDate: true, 
		   	turnsInPlay: true
	    }, 
	    execution: {
	    	lockedOrderto: 120000,
	    	defaultOrderSize: 2
	    }
      },
      amqp : {
    	queues: {
    		defaultpub: 'com.bfair.pricing.default',
    		defaultsub: 'com.bfair.pricing.default',
    		marketpub: 'com.bfair.pricing.market',
    		pricesub: 'com.bfair.pricing.price',
    		idclusterpub: 'com.bfair.pricing.idcluster'
    	} ,
    	routingkey: 'com.bfair.pricing.default'  
      }
    }
  , test: {
	  
    }
  , production: {

    }
}