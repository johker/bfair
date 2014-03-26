/**
 * Test environments and configurations
 */

var root = '../../' 
	, rtc = require(root + 'app/controllers/configcontroller')


console.log(rtc.getConfig('db'));


