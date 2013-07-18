 var keysmpl = ['Granollers', 'Djokovic', 'Murray', 'Federer', 'Ferrer', 'Nadal', 'Berdych', 'Tsonga', 'Del Potro', 'Gasquet', 'Wawrinka', 'Haas', 'Cilic', 'Nishikori', 'Tipsarevic', 'Raonic', 'Almagro', 'Simon', 'Kohlschreiber', 'Querrey', 'Monaco']
 var keysfpl = ['Minella', 'Williams', 'Azarenka', 'Sharapova', 'Radwanska', 'Errani', 'Li', 'Kerber', 'Kvitova', 'Wozniacki', 'Kirilenko', 'Vinci', 'Ivanovic', 'Petrova', 'Stosur', 'Bartoli', 'Jankovic', 'Stephens', 'Cibulkova', 'Suarez Navarro', 'Flipkens']
 var maxIndex = 5;
 	
 var _ = require('underscore'); 	
 	
/**
* Takes first n entries from male and female player 
* arrays where n is specified by maxIndex. 
*/ 
function generateKeys() {
	return keysmpl.slice(0,maxIndex).concat(keysfpl.slice(0, maxIndex));
}
 	
/**
* Removes object attributes without a name containing 
* a player key word.
*/ 
exports.byPlayer = function(events) {
	var keys = generateKeys();
	return resf = _.filter(events, function(obj) {
		var ret; 
		for(var i in keys) {
			ret = ret || ~obj.event.name.toLowerCase().indexOf(keys[i].toLowerCase()); 
		}
		return ret;
	});
 } 
 
 
 