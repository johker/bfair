 var types = ['SET_WINNER', 'MATCH_ODDS', 'ODDS'];
 var projections = ['COMPETITION', 'EVENT', 'EVENT_TYPE', 'MARKET_START_TIME', 'MARKET_DESCRIPTION', 'RUNNER_DESCRIPTION', 'RUNNER_METADATA'];
 var sorts = ['MINIMUM_TRADED', 'MAXIMUM_TRADED', 'MINIMUM_AVAILABLE', 'MAXIMUM_AVAILABLE', 'FIRST_TO_START', 'LAST_TO_START'];

exports.getTypes = function() {
	return types;
} 


exports.getMarketProjection = function() {
	return [projections[1], projections[3]]; 
}

exports.getMarketSort = function() {
	return sorts[4];
}