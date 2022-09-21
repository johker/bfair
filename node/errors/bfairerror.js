/**
 * Customized Error function with stacktrace information
 */
var util = require('util')
	, root = '../'


/**
* @param codes - Error code - defined in codes.js
* @param message - Error message 
*/
function BfairError(code, message) {
  Error.call(this); //super constructor
  Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

  // this.name = this.constructor.name; //set our function’s name as error name.
  this.name = code.name; 
  this.message = message; //set the error message
  this.code = code;
}

// inherit from Error
util.inherits(BfairError, Error);


module.exports = BfairError;