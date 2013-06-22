
var winston = require('winston')

  var myCustomLevels = {
    levels: {
      foo: 0,
      bar: 1,
      baz: 2,
      foobar: 3
    },
    colors: {
      foo: 'blue',
      bar: 'green',
      baz: 'yellow',
      foobar: 'red'
    }
  };

  var customLevelLogger = new (winston.Logger)({ 
  		levels: myCustomLevels.levels,
  		transports: [new (winston.transports.Console)({ json: false, timestamp: true  })]
  		 });
  
  
  
  
  customLevelLogger.foobar('some foobar level-ed message');
  
  console.log(winston.config.syslog.levels); 