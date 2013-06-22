/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
	, root = '../../'
	, Account = mongoose.model('Account')
	, bundle = require(root + 'config/resourcebundle')['en']

/**
* Bf Accounts Handler
*/
exports.account = function(req, res) {
	Account.find({},'bfUsername id active', function (err, bf_accounts) {
    if(err) {
    	res.render('500');
    }
    res.render('account', {
       title: bundle.title.account,
       username: req.user.username,
       accounts: JSON.stringify(bf_accounts)
    });
  });
};

/**
* Sets the active flag according to the accountId of the request body 
* and redirects to the account page.
*/
exports.updateAccount = function(req, res) {
	Account.findOne({ active: true }, function (err, oacc){
		  oacc.active = false;
		  oacc.save(function(err) {
		  		Account.findOne({ id: req.body.accountId }, function (err, nacc){
		  			nacc.active = true;
		  			nacc.save();
		  		});
		  });
		});
   		res.redirect('/account');
};

/**
* Returns the selected account
*/
exports.getSelectedAccount = function(callback) {
	Account.findOne({ active: true }, function (err, acc){
		if(err) sysLogger.error('<accountcontroller> <getSelctedAccount> ' + err);
		callback(acc, err);		
	});
}


module.exports.getDefaultAccount = function() {
	Account.findOne({ active: true }, function (err, acc){
			if(err) sysLogger.error('<accountcontroller> <getDefaultAccount> ' + err);
			return acc;	
		});
}



module.exports.getSESCredentials = function() {
	Ses.find({}, function (err, ses){
			if(err) sysLogger.error('<accountcontroller> <getDefaultAccount> ' + err);
			return ses;	
		});
}


