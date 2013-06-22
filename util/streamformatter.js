 /**
 * A hacked querystream formatter which formats the output
 * as a json literal. Not production quality.
 * Taken from: https://gist.github.com/aheckmann/1403797
 */ 
  
 var mongoose = require('mongoose')
  , root = '../'
  , Stream = require('stream').Stream


  , sysLogger = require(root + 'config/winston').getSysLogger();
 
 
var ArrayFormatter = function() {
  Stream.call(this);
  this.writable = true;
  this._done = false;
}

ArrayFormatter.prototype.__proto__ = Stream.prototype;

 
ArrayFormatter.prototype.write = function (doc) {
	var x = ('' + doc)
			.replace(/{/g,'')
			.replace(/}/g,'')
			.replace(/\n/g, '')
			.replace(/["']/g, "")
			.trim();			
			
  if (! this._hasWritten) {
    this._hasWritten = true;
 	this.emit('data', x); 
  } else {
  	var y = x.replace('mid', '\n mid');
    this.emit('data', ',' + y);
  }
 
  return true;
}


/*
ArrayFormatter.prototype.write = function (doc) {

	var line = ('' + doc)
			.replace(/{/g,'')
			.replace(/}/g,'')
			.replace(/mid/g,'\n mid')
			.trim();
  if (! this._hasWritten) {
    this._hasWritten = true; 
    // open an object literal / array string along with the doc
    this.emit('data', '{ "results": [' + line );
 
  } else {
    this.emit('data', ',' + line);
  }
 
  return true;
}

*/

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}



/*
var index = 0;
var buffer = ''; 
 
ArrayFormatter.prototype.write = function (doc) {
	var line = ('' + doc)
		.replace(/{/g,'')
		.replace(/},/g,';')
		.replace(/}/g,'')
		.trim();
	index++;	
	if(index % 2 == 0) this.emit('data', line + buffer);
		else buffer = '' + line; 
	return true;
}

*/
 
ArrayFormatter.prototype.end =
ArrayFormatter.prototype.destroy = function () {
  if (this._done) return;
  this._done = true; 
  sysLogger.notice('<streamformatter> <ArrayFormatter.prototype.destroy>');
  // done
  this.emit('end');
}

module.exports.createFormatter = function() {
	sysLogger.notice('<streamformatter> <ArrayFormatter.prototype.createFormatter>');
	var formatter = new ArrayFormatter();
	return formatter;
};
