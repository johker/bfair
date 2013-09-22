module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      filetype: '.csv',
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
      	eventTypeId: '2'  		
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
      	level: 'warning'			// debug: 0,  info: 1,  notice: 2,  warning: 3,  error: 4,  crit: 5,  alert: 6,  emerg: 7
      }, 
      api: {
      	marketName: 'Wettquoten',
      	baseto: {
      		market: 10000, 	// Timeout for market requests
      		price: 1000    // Basic Timeout price requests
      	},
      	throttle: {
      		fac1: 10,
      		fac2: 5,
      		fac3: 2, 
      		fac4: 1, 
      		th1: 10,
      		th2: 100, 
      		th3: 1000,
      		thupdt: 10 
      	}, 
      	batch: {
      		size: 10,
      		max: 10
      	},
      	trigger: {
      	
      	},
      	eventType: '2',
      	maxResults: '100'     
      }, 
      execution: {
      	tmThreshold: 1000
      }
    }
  , test: {
	  root: require('path').normalize(__dirname + '/..'),
      filetype: '.csv',
      mail: {
      	collection: 'ses',
      	host: 'localhost',
      	port: '27017',
      	db: 'be-fair-authentication', 
      	sender : 'befairsystem@gmail.com',
      	to : 'johannes.kern@zoho.com'    
      },
      values: {
      	eventTypeId: '2'
      },
      betfair: {
      	applicationkey: 'CTQjpSLoJtFMjLnt', 
      	user: 'nagarjuna23', 
      	password: '66cdd273'      		
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
      	 	prices: 'prices',    // Logged prices of selected market IDs
      	 	prefix: 'mid'
      	 },
      	level: 'info'			// debug: 0,  info: 1,  notice: 2,  warning: 3,  error: 4,  crit: 5,  alert: 6,  emerg: 7
      }, 
      api: {
      	marketName: 'Wettquoten',
      	baseto: {
      		market: 30000, 
      		price: 1000
      	},
      	eventType: '2',
      	maxResults: '100'     
      },
      execution: {
      	tmThreshold: 1000
      }  	
    }
  , production: {

    }
}