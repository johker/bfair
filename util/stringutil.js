var env = process.env.NODE_ENV || 'development'
 , root = '../'
 , config = require(root + 'config/config')[env]

var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];


Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

exports.adjustTimezone = function(date) {
	return date.addHours(config.timezoneShiftGMT);
}

/**
* Parse date from a string of the form 
* 2013-11-20T11:11:00.000Z
*/
exports.parseBetfairDate = function(input) {
	if(input == null) return null;
	input = replaceAll('z', '', input); 
	input = replaceAll('T', '-', input); 
	input = replaceAll(':', '-', input); 
	var res = input.split("-");
	return new Date(res[0], res[1]-1, res[2], res[3], res[4], 0, 0)
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

exports.parseDate = function(input) {
	if(input == null) return null;
	var parts = input.match(/(\d+)/g);
	if(parts == null) return null;  
	return new Date(parts[2], parts[1]-1, parts[0], parts[3], parts[4], parts[5], 0); // months are 0-based
};

exports.getFormatedDate = function (time) {
	var currentDate = new Date(time); 
	currentDate = currentDate.toISOString();
	currentDate = currentDate.replace(/T/, ' ');
	currentDate = currentDate.replace(/\..+/, ''); 
	return currentDate;
}

exports.millisToDate = function(millis) {
	var n = +millis;
	var d = new Date(n);
	var f = ('0' + (d.getMonth()+1)).slice(-2) + '/' 
	+ ('0' + d.getDate()).slice(-2) + '/' 
	+ d.getFullYear() + ' ' 
	+ ('0' + d.getHours()).slice(-2) +':' 
	+ ('0' + d.getMinutes()).slice(-2) + ':' 
	+ ('0' + d.getSeconds()).slice(-2) + ' ' 
	//+ d.getMilliseconds() + 'ms';  
	return f;
}

exports.getLastPathElement = function(menuPath) {
	var elements = menuPath.split("\\");
	return elements.slice(-1)[0];	
	
} 