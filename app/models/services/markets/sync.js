/**
 * Module used to merge incoming and cached markets
 */
 
var root = '../../../../'
	, _ = require('underscore')
	, utils = require(root + 'util/listutil')

/**
 * Synchronize incoming markets with cached ones.
 * @param {array} cached Array of cached markets
 * @param {array} incoming Array of incoming markets
 * @param {string} mid name of the identifier property of market objects
 * @param {function} add function to call for new markets 
 * @param {function} remove function to call for stale markets
 * @param {function} update function to call for intersecting markets
 */
 module.exports.markets = function(cached, incoming, mid, add, remove, update) {
 	var mapN = utils.mapFromArray(incoming, mid); 
	for (var id in cached) {
        if (!mapN.hasOwnProperty(id)) {            
              remove(id);
    	}
    }
    for (var id in mapN) {
        if (!cached.hasOwnProperty(id)) {
     		   add(mapN[id], id);     		   
        } 
        else {
        	update(mapN[id], id);
        }
    }
 
 }  
