
/**
 * Creates a map out of an array be choosing what property to key by
 * @param {object[]} array Array that will be converted into a map
 * @param {string} prop Name of property to key by
 * @return {object} The mapped array. Example:
 *     mapFromArray([{a:1,b:2}, {a:3,b:4}], 'a')
 *     returns {1: {a:1,b:2}, 3: {a:3,b:4}}
 */
module.exports.mapFromArray = function(array, prop) {
    var map = {};
    for (var i=0; i < array.length; i++) {
        map[ array[i][prop] ] = array[i];
    }
    return map;
}
 
 
/**
* Counts object properties.
*/
module.exports.count = function(obj) {
   var count=0;
   for(var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
         ++count;
      }
   }
   return count;
}

/**
* Array Remove - By John Resig (MIT Licensed)
*/
module.exports.removeFromArray = function(array, from, to) {
	var rest = array.slice((to || from) + 1 || array.length);
  	array.length = from < 0 ? array.length + from : from;
  	return array.push.apply(array, rest);
} 


/**
* Delete given element from array using 'splice' instead of 'delete'
*/
module.exports.removeByAttr = function(arr, attr, value) {
    var i = arr.length;
    while(i--){
       if(arr[i] && arr[i][attr] && (arguments.length > 2 && arr[i][attr] === value )){
           arr.splice(i,1);
       }
    }
    return arr;
}

/**
*
*/ 
module.exports.arrayContains = function(array, obj) {
    for (var i = 0; i < array.length; i++) {
    	console.log('obj = ' + obj);
    	console.log('array[i] = ' + array[i]); 
        if (JSON.stringify(array[i]).contains(obj)) {
        	console.log('true');
            return true;
        }
    }
    return false;
}

/**
*
*/
module.exports.setNestedProp = function (obj, level, val){
    if(level > 0){
        setNest(obj.subobject, level-1, val);
    }
    else{
        obj.subobject = val;
    }
}
