/**
 * Dynamic generators and accessors of js objects 
 */

 
/**
* Function: setNestedValue( base, names[, value] )
* @param base: the object on which to create the hierarchy
* @param names: an array of strings contaning the names of the objects
* @param value (optional): if given, will be the last object in the hierarchy
* @return the last object in the hierarchy
* @see http://stackoverflow.com/questions/5484673/javascript-how-to-dynamically-create-nested-objects-using-object-names-given-by
*/
exports.setNestedValue = function( base, names, value ) {
    // If a value is given, remove the last name and keep it for later:
    var lastName = arguments.length === 3 ? names.pop() : false;

    // Walk the hierarchy, creating new objects where needed.
    // If the lastName was removed, then the last object is not set yet:
    for( var i = 0; i < names.length; i++ ) {
        base = base[ names[i] ] = base[ names[i] ] || {};
    }

    // If a value was given, set it to the last name:
    if( lastName ) base = base[ lastName ] = value;

    // Return the last object in the hierarchy:
    return base;
};

/**
* Returns the value for a given key or null 
* if the key does not exist.
* @param object - object to retrieve value from
* @param key - object hierarchy
* @return object value
* @see http://stackoverflow.com/questions/4431641/javascript-access-nested-values-in-json-data-using-dynamic-variable-names
*/
exports.getValue = function(object, key) {
  key = key.split('.');
  for (var i = 0, len = key.length; i < len - 1; i++) {
    object = object[key[i]];
    if(object == undefined) {
    	return null;
    }
	}
  return object[key[len - 1]] ;
}

