/**
 * Hierarchical environment based properties. Rest of environments are deep merged over `common`.
 */

var root = '../' 


module.exports = {
		common: require(root + 'config/env/common')
	  , development: require(root + 'config/env/development')
	  , test: require(root + 'config/env/test')
	  , production: require(root + 'config/env/production')
};