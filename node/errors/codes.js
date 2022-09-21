var enums = require("./enums.js");

// GLOBAL error codes
CODES = new enums.Enum({
        INTERNAL_ERROR: {description: 'Unexpected internal error', name: "InternalError", code: 0},
        GENERAL_ERROR: {description: 'Not further specified error', name: "GeneralError" , code: 10},
        DEFERED_THEORETICAL: { description: "Stale Price from AMQP" , name: "DeferedTheoreticalError", code: 20},
        NO_CONNECTION: { description: "Unable to connect to Internet" , name: "ConnectionError", code: 30}
    });
   
    
    
