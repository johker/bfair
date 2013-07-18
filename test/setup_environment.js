/**
 * Bootstrap necessary libraries for testing
 */
module.exports = {
	var util = require('util')
		, winston = require(root + 'config/winston')
		, async = require('async')
		, assert = require('assert')
		, expect = require('expect.js')
		, betfair = require('betfair');
		, sysLogger = winston.getSysLogger();
}