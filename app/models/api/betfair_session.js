//(C) 2013 Anton Zemlyanov

//This module describes Betfair session
//see Sports API documentation on http://bdp.betfair.com

// no login/logout in the new API yet
//var v6 = require('betfair-sports-api');
var invocation = require('./betfair_invocation.js');
var auth = require('./betfair_auth.js');
var BetfairInvocation = invocation.BetfairInvocation;

var emulator = require('./emulator.js');
var root = '../../../'
	, rtc = require(root + 'app/controllers/configcontroller');


function BetfairSession() {
	var self = this;
	self.marketEmulationModes = {};
}

// ************************************************************************
// * Application Keys
// ************************************************************************
BetfairSession.prototype.setApplicationKeys = function (keys) {
	keys = keys || {};
	invocation.setApplicationKeys(keys.active, keys.delayed);
}

// ************************************************************************
// * Invocations log
// ************************************************************************
BetfairSession.prototype.startInvocationLog = function (filename, level) {
	level = level || 'info';
	invocation.startInvocationLog(filename, level);
}

BetfairSession.prototype.stopInvocationLog = function () {
	invocation.stopInvocationLog();
}

// ************************************************************************
// * Emulator stuff
// ************************************************************************

// Enable emulator for market
BetfairSession.prototype.enableBetEmulatorForMarket = function (marketId) {
	emulator.enableBetEmulatorForMarket(marketId);
}

// Disable emulator for market
BetfairSession.prototype.disableBetEmulatorForMarket = function (marketId) {
	emulator.disableBetEmulatorForMarket(marketId);
}

// Emulator status for market
BetfairSession.prototype.isMarketUsingBetEmulator = function (marketId) {
	return emulator.isMarketUsingBetEmulator(marketId);
}

BetfairSession.prototype.startEmulatorLog = function (streams) {
	emulator.startEmulatorLog(streams);
}

BetfairSession.prototype.stopEmulatorLog = function () {
	emulator.stopEmulatorLog();
}

// ************************************************************************
// * Login stuff
// ************************************************************************

// Open current session
BetfairSession.prototype.login = function (login, password, sslOptions, cb) {
	var self = this;

	// allow sslOptions to be skipped, then it's interactive login
	if (typeof(sslOptions) === 'function') {
		cb = sslOptions;
		sslOptions = {};
	}
	sslOptions = sslOptions || {};
	cb = cb || function () {
	};

	// test login is interactive or bot
	this.loginType = 'interactive';
	if (sslOptions.key && sslOptions.cert) {
		this.loginType = 'bot';
	}

	self.login = login;
	self.password = password;

	function onLoginResult(err, res) {
		if (err) {
			cb(err, res);
			return;
		}
		self.sessionKey = res.sessionKey || "";
		cb(err, res);
	}

	switch (this.loginType) {
		case 'interactive':
			auth.interactiveLogin(login, password, onLoginResult);
			break;
		case 'bot':
			auth.botLogin(login, password, sslOptions, onLoginResult);
			break;
	}
	return;
}

// Close current session
BetfairSession.prototype.logout = function (cb) {
	var self = this;

	cb = cb || function () {
	};

	// Compatibility mode, use old V6 login
	cb(null, {comment: "BYPASS_FOR_NOW", duration: 0});
}

// ************************************************************************
// * Generic invocation
// ************************************************************************
function createInvocation(api, methodName, isEmulated) {
	return function (params, cb) {
		var self = this;
		cb = cb || function () {
		};
		if(typeof(params)!=='object') {
			throw('No parameters provided for '+methodName);
		}
		var invocation = new BetfairInvocation(api, self.sessionKey, methodName, params, isEmulated);
		invocation.execute(function (err, inv) {
			cb(err, inv);
		});
		return invocation;
	}
}

// ************************************************************************
// * Accounts API - https://beta-api.betfair.com/account/json-rpc
// ************************************************************************
BetfairSession.prototype.createDeveloperAppKeys = createInvocation("accounts", "createDeveloperAppKeys");
BetfairSession.prototype.getDeveloperAppKeys = createInvocation("accounts", "getDeveloperAppKeys");

// ************************************************************************
// * Sports (Betting) API - https://beta-api.betfair.com/betting/json-rpc
// ************************************************************************
// readonly
BetfairSession.prototype.listCompetitions = createInvocation("sports", "listCompetitions");
BetfairSession.prototype.listCountries = createInvocation("sports", "listCountries");
BetfairSession.prototype.listCurrentOrders = createInvocation("sports", "listCurrentOrders", rtc.getConfig('api.emulated'));
BetfairSession.prototype.listEvents = createInvocation("sports", "listEvents");
BetfairSession.prototype.listEventTypes = createInvocation("sports", "listEventTypes");
BetfairSession.prototype.listMarketBook = createInvocation("sports", "listMarketBook", rtc.getConfig('api.emulated'));
BetfairSession.prototype.listMarketCatalogue = createInvocation("sports", "listMarketCatalogue");
BetfairSession.prototype.listMarketTypes = createInvocation("sports", "listMarketTypes");
BetfairSession.prototype.listTimeRanges = createInvocation("sports", " listTimeRanges");
BetfairSession.prototype.listVenues = createInvocation("sports", "listVenues");

// betting
BetfairSession.prototype.placeOrders = createInvocation("sports", "placeOrders", rtc.getConfig('api.emulated'));
BetfairSession.prototype.replaceOrders = createInvocation("sports", "replaceOrders", rtc.getConfig('api.emulated'));
BetfairSession.prototype.updateOrders = createInvocation("sports", "updateOrders", rtc.getConfig('api.emulated'));
BetfairSession.prototype.cancelOrders = createInvocation("sports", "cancelOrders", rtc.getConfig('api.emulated'));



// ************************************************************************
// * Scores API - https://api.betfair.com:443/exchange/account/json-rpc/v1/
// ************************************************************************
BetfairSession.prototype.listScores = createInvocation("scores", "listScores");
BetfairSession.prototype.listIncidents = createInvocation("scores", "listIncidents");
BetfairSession.prototype.listAvailableEvents = createInvocation("scores", "listAvailableEvents");

module.exports = BetfairSession;
