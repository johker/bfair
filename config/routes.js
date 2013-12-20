var root = '../'  
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Account = mongoose.model('Account')
  , bundle = require(root + 'config/resourcebundle')['en']
  , csv = require('csv')
  , fs = require('fs')
  , _ = require('underscore')
  , notifier = require(root + 'app/models/services/notifier')

  
module.exports = function (app, passport, auth) {

// controllers
var cns = root + '/app/controllers/'
var uctrl = require(cns + 'usercontroller');
var actrl = require(cns + 'accountcontroller');
var apictrl = require(cns + 'apicontroller');
var dctrl = require(cns + 'datacontroller');
var cctrl = require(cns + 'configcontroller'); 

// user routes
app.get('/', uctrl.login);
app.get('/logout', uctrl.logout)
app.post('/users/session', passport.authenticate('local', {failureRedirect: '/', failureFlash: 'Invalid email or password.'}), uctrl.session)
app.get('/users/:userId', uctrl.show)

// Content routes
// app.get('/overview', auth.requiresLogin, uctrl.overview);
// app.get('/data', auth.requiresLogin, dctrl.data);
app.get('/account', auth.requiresLogin, actrl.account);
app.get('/markets', auth.requiresLogin, apictrl.markets);
app.get('/orders', auth.requiresLogin, apictrl.orders);
app.post('/', 
	passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
	function(req, res) {
		sysLogger.info('<routes> <passport> <authenticate> Authenticated');
		res.redirect('/markets');
});

app.post('/account', 
	function(req, res) {		
		if (req.body.accountId != null) {
			actrl.updateAccount(req, res);			
		}		
});
app.post('/overview',function(req, res) {	});

app.post('/validate', function(req, res) {
	sysLogger.notice('<routes> <post:validate> ' )
	console.log(req.body); 
	dctrl.validateEntries(req,res, function(values, err) {
		if (err) sysLogger.error('<routes> <validateEntries:callback> ' +err);
		sysLogger.info('<routes> <validateEntries:callback> Entries not validated');
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.write(JSON.stringify(values));
    	res.end(); 
	});
});

app.post('/export', function(req, res) {
	dctrl.exportLogs(req, res);
});

app.post('/delete', function(req, res) {
	dctrl.deleteLogs(req, res);
});

app.post('/detail', function(req, res) {
	try {	
		if(req.body.operation == 'lock') {
			cctrl.setConfig('api.lockedMarketId', req.body.marketId);
			cctrl.setConfig('api.lockedEventId', req.body.eventId);
		} else {
			apictrl.pricedetail(req, res);
		}
	} catch (ex) {
		sysLogger.error('<routes> <post:detail> ' +  JSON.stringify(ex));	
	}
});

app.post('/markets', function(req, res) {
	try {
		apictrl.markets(req, res);
	} catch (ex) {
		sysLogger.error('<routes> <post:markets> ' +  ex);	
	}	
}); 

var selectedId; // has to be set via ajax request
var doexport; // Export flag for history submits
app.io.route('export', function(req) {	
	sysLogger.info('<routes> doexport = true');
	doexport = true; 
})

app.post('/history', function(req, res) {
	sysLogger.debug('<routes> <post:history> Market ID : ' +  req.body.marketId);
	sysLogger.debug('<routes> <post:history> Operation : ' +  req.body.operation);
	sysLogger.debug('<routes> <post:history> selectedId : ' +  selectedId);
	try {	
		if(req.body.operation == 'delete') {
			sysLogger.debug('<routes> <post:history> Deleting History for selected ID : ' + selectedId);
			apictrl.removehistory( '1.' + req.body.marketId);	
		} else if(req.body.operation == 'deleteall') {
			sysLogger.debug('<routes> <post:history> Deleting complete History');
			apictrl.removecompletehistory();	
		} else if(req.body.operation == 'setExportId') {
			sysLogger.debug('<routes> <post:history> Setting export ID : ' + req.body.marketId);
			selectedId = req.body.marketId;
		} else if(req.body.operation == 'resetExportId') {
			sysLogger.debug('<routes> <post:history> Resetting export ID');
			selectedId = undefined;
		} else {
			// 'Regular' POST rquests
			// AJAX rquest doesnt work with streaming
			if(doexport) { // distingiush between export and navigation to history page
				sysLogger.crit('<routes> <post:history> Exporting History for selected ID : ' +  '1.' + selectedId);			
				apictrl.exporthistory( '1.' + selectedId, res);	
				doexport = false;
			} else {
				apictrl.history(req, res);
			}
		}			
		
	} catch (ex) {
		sysLogger.error('<routes> <post:history> ' +  JSON.stringify(ex));	
	}	

}); 

app.post('/validateorder', function(req, res) {
	apictrl.validateorder(req,res, function(values, err) {
		sysLogger.debug('<routes> <validateorder:callback> Entries not validated');
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.write(JSON.stringify(values));
	    res.end();
	});
	
});




}