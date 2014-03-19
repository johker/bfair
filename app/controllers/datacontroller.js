/**
* DEPRECATED
*/
var root = '../../'
	, datamodel = require(root + 'app/models/db/db_prices')
	, bundle = require(root + 'config/resourcebundle')['en']
	, async = require('async')
	, su = require(root + 'util/stringutil')
	, expressValidator = require('express-validator')
	, startDate
	, endDate
	, operation
	, values = {};



expressValidator.Validator.timeRange = function(startStr, endStr) {
	if(startStr == '' || endStr == '') return this;
	startDate = su.parseDate(startStr);
	endDate = su.parseDate(endStr);
	if (startDate - endDate > 0) {		
        this.error(this.msg || 'Invalid time range');
    }	
    return this; //Allow method chaining
}


exports.data = function(req, res) {
	values.username = req.user.username;
	initValues();	
	res.render('data', values);	
};   


/**
* Sets default values for form elements.
*/
function initValues() {
	values.title = ''; 
	values.eventId = '';
	values.startDate = '';
	values.endDate = '';
}


/**
* Checks if there are validation errors and fills the values object accordingly
*/
function setValidationValues(eid, sdate, edate, targetId, errMsgs) {
	values.title = bundle.title.data;	
	values.eventId = eid;
	values.startDate = sdate;
	values.endDate = edate;
	values.operation = '' + targetId;
	if(errMsgs != null) {
		values.errorTitle = bundle.validation.errtitle;
		values.errors = errMsgs;	
	} else {
		values.errorTitle = undefined; 
		values.errors = undefined;
	}
}

/**
* Sets confirmation values.
*/
function setConfirmationValues(eid, sdate, edate, targetId, numRemoved) {
	values.title = bundle.title.data;	
	values.eventId = eid;
	values.startDate = sdate;
	values.endDate = edate;
	values.operation = '' + targetId;
	values.msgTitle = bundle.messages.logs.title;
	values.msgContent = bundle.messages.logs.confirmation + numRemoved;		
}


/**
* Extracts the error messages from the validationErrors array
*/
function inspect(validationErrors) {
	sysLogger.info('<datacontroller> <inspect> Validation Errors: ' +  validationErrors);
	if(validationErrors == null) return null; 
	var errMsgs = {};
	for (var err in validationErrors) {
		errMsgs[err] = validationErrors[err].msg;
	}
	return errMsgs;

}

/**
* Validates form entries and sets the operation to execute on next. It returns the values and 
* possible errors 
*/
exports.validateEntries = function(req, res, callback) {
	operation = req.body.operation;
	sysLogger.info('<datacontroller> <validateEntries> Operation set: ' + operation);
    req.assert('eventId', bundle.validation.novalidid).isInt();
	req.assert('startDate',bundle.validation.novalidtimerange).timeRange(req.body.startDate, req.body.endDate);	
	var errMsgs = inspect(req.validationErrors());	
	setValidationValues(req.body.eventId, req.body.startDate, req.body.endDate, req.body.operation, errMsgs);
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.write(JSON.stringify(values));
	res.end(); 	
  
};

/**
* Performs db operation based on target id (operation)
* set in validation step.
*/
exports.executeOperation = function(req,res) {
	sysLogger.info('<datacontroller> <executeOperation>');
    if(operation == 'export') exportLogs(req, res);
	else if(operation == 'delete') removeLogs(req, res); 
}

/**
* Calls the model to stream documents matching the conditions
*/
exports.exportLogs = function(req, res) {
	sysLogger.notice('<datacontroller> <exportLogs>')
	datamodel.exportLogs(req.body.eventId, req.body.startDate, req.body.endDate, res, function(err) {
       if (err) return err; 
    });

};

/**
* Calls the model to remove documents matching the conditions
*/
exports.deleteLogs = function(req, res) {
	sysLogger.info('<datacontroller> <removeLogs>')
	datamodel.removeLogs(req.body.eventId, req.body.startDate, req.body.endDate, function(numberRemoved, err) {
		if (err) return err;
		setConfirmationValues(req.body.eventId, req.body.startDate, req.body.endDate, req.body.operation, numberRemoved);
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.write(JSON.stringify(values));
		res.end();	
    });
}



