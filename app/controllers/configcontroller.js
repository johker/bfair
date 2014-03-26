/**
 * Sets configs at runtime. Default configs are provided as fallback
 */
var root = '../../'
	, env = process.env.NODE_ENV || 'development'
	, bundle = require(root + 'config/resourcebundle')['en']
	, servicedir = root + 'app/models/services/'
	, Settings = require('settings')
	, config = new Settings(require(root + 'config/config'))
	, dynconfig = require(servicedir + 'dynconfig')
	, dynobs = require(root + 'util/dynobjects')
	
	
/**
* Returns the value for runtime settings. 
* If no value is set or the key does not
* exist, it falls back on static properties - provided by config.js
*/
exports.getConfig = function(key) {
	// TODO: Define exceptions for performance improvement - e.g. db settings
	if(key == 'api.lockedEventId') {
		sysLogger.debug('<configcontroller> <getConfig> key = ' + key + ', value = ' + (dynconfig.get(key) != null ? dynconfig.get(key) : dynobs.getValue(config, key)));
	} 
	return dynconfig.get(key) != null ? dynconfig.get(key) : dynobs.getValue(config, key); 
}

/**
* Adds value to runtime settings 
*/ 
exports.setConfig = function(key, value) {
	dynconfig.set(key, value); 
	sysLogger.critical('<configcontroller> <setConfig> key = ' + key + ', value = ' + value); 
}

