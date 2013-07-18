/**
 * New node file
 */

 
 
 
 exports.priceData = function() {
 	 //return ['SP_AVAILABLE', 'SP_TRADED', 'EX_BEST_OFFERS', 'EX_ALL_OFFERS', 'EX_TRADED'];
 	 return ['EX_BEST_OFFERS']; 
 } 
 
 exports.getExBestOffersOverrides = function() {
 	return null; 	
 }