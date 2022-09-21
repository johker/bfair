/**
 * Compares new markets with preselected list
 * and inititiates logging accordingly
 */
var env = process.env.NODE_ENV || 'development'
 , root = '../../../'
 , listutils = require(root + 'util/listutil')
 , strutils = require(root + 'util/stringutil')
 , mocktags = require(root + 'test/mock/marketfactory').getMockTags()
 , tags = require(root +  'config/runners').getTags()

exports.marketOfInterest = function(market) {
	 if(env == 'test') { 	 
        if(mocktags.indexOf(strutils.getLastPathElement(market.menuPath).trim())>-1) {
        	return true; 
        } 
     } else {
         if(tags.indexOf(strutils.getLastPathElement(market.menuPath).trim())>-1) {
        	return true; 
     }  

}
}
