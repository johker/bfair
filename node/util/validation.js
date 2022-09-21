/**
 * New node file
 */

 
 /**
* Extracts the error messages from the validationErrors array
*/
exports.inspect = function(validationErrors) {
	sysLogger.info('<datacontroller> <inspect> Validation Errors: ' +  validationErrors);
	if(validationErrors == null) return null; 
	var errMsgs = {};
	for (var err in validationErrors) {
		errMsgs[err] = validationErrors[err].msg;
	}
	return errMsgs;
}

exports.isNumber = function(o) {
  return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
}