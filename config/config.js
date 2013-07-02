module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      filetype: '.csv',
      betfair: {
      	applicationkey: 'CTQjpSLoJtFMjLnt', 
      	user: 'nagarjuna23', 
      	password: '66cdd273', 
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
      	 	prices: 'prices',    // Logged prices of selected market IDs
      	 	prefix: 'mid'
      	 },
      	level: 'info'			// debug: 0,  info: 1,  notice: 2,  warning: 3,  error: 4,  crit: 5,  alert: 6,  emerg: 7
      }, 
      api: {
      	marketName: 'Wettquoten',
      	timeout: 10000,
      	eventType: '2'     
      },
      mail: {
      	sender : 'befairsystem@gmail.com',
      	to : 'johannes.kern@zoho.com'      	
      }
    }
  , test: {
	  root: require('path').normalize(__dirname + '/..'),
      filetype: '.csv',
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
      	level: 'error'			// debug: 0,  info: 1,  notice: 2,  warning: 3,  error: 4,  crit: 5,  alert: 6,  emerg: 7
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