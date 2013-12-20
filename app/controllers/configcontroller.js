/**
 * Sets configs at runtime. Default configs are provided as fallback
 */
var root = '../../'
	, env = process.env.NODE_ENV || 'development'
	, bundle = require(root + 'config/resourcebundle')['en']
	, servicedir = root + 'app/models/services/'	
	, config = require(root + 'config/config')[env] 
	, dynconfig = require(servicedir + 'dynconfig')
	, dynobs = require(root + 'util/dynobjects')
	
	
/**
* Returns the value for runtime settings. 
* If no value is set or the key does not
* exist, it falls back on static properties - provided by config.js
*/
exports.getConfig = function(key) {
	return dynconfig.get(key) != null ? dynconfig.get(key) : dynobs.getValue(config, key); 

}

/**
* Adds value to runtime settings 
*/ 
exports.setConfig = function(key, value) {
	dynconfig.set(key, value); 
	sysLogger.crit('<configcontroller> <setConfig> key = ' + key + ', value = ' + value); 
}

