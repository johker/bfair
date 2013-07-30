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
      	level: 'info'			// debug: 0,  info: 1,  notice: 2,  warning: 3,  error: 4,  crit: 5,  alert: 6,  emerg: 7
      }, 
      api: {
      	marketName: 'Wettquoten',
      	timeout: 1000,
      	eventType: '2'     
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
      	timeout: 5000,
      	eventType: '2'     
      }   	
    }
  , production: {

    }
}