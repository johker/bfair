/**
 * Parses price inforamtion from book
 */

 
 exports.getPriceInformation = function(book) {
 	var p = {};	
	p['timestamp'] = (new Date()).getTime();
	p['message'] = ''; 
	for ( var pIdx = 0; pIdx < book.runners.length; pIdx++) {
		var avaliableToBack = book.runners[pIdx].ex.availableToBack;		
		for(var bIdx = 0; bIdx < avaliableToBack.length; bIdx++) {
			var index = '' + pIdx + bIdx;
			p['vb' + index] = avaliableToBack[bIdx].size;								
			p['pb' + index] = avaliableToBack[bIdx].price;		
		}
		var availableToLay = book.runners[pIdx].ex.availableToLay;
		for(var bIdx = 0; bIdx < availableToLay.length; bIdx++) {
			var index = '' + pIdx + bIdx;
			p['vl' + index] = availableToLay[bIdx].size;									
			p['pl' + index] = availableToLay[bIdx].price;		
		}
	}
	return p; 
 
 } 
 
  exports.getDataTransferObject = function(book) {
 	var dto = {}; 
 	dto['marketId'] = book.marketId;
 	var runners = []
 	for ( var pIdx = 0; pIdx < book.runners.length; pIdx++) {
 		var r = {}
 		r['selectionId'] = book.runners[pIdx].selectionId;
		r['availableToBack'] = book.runners[pIdx].ex.availableToBack;
		r['availableToLay'] = book.runners[pIdx].ex.availableToLay;
		runners.push(r) 
	}
	dto['runners'] = runners; 
	return dto; 
 } 