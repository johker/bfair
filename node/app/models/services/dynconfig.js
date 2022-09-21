/**
* Object representation of dynamic properties
*/

var root = '../../../'
	, dynobs = require(root + 'util/dynobjects')
	, data = {}; 

/**
* Returns value or null if not exists
*/
data.get = function(key) {
	return dynobs.getValue(this, key); 
};

/**
* Sets value and creates object hierarchy if necessary
* @param key - object hierarchy
* @param value - value to set
*/
data.set = function(key, value) {
 	dynobs.setNestedValue(this, key.split('.'), value); 
};

module.exports = data; 
