/**
 * New node file
 */

var root = '../../../../'
 
 var session = require(root + 'app/models/services/session')
 , winston = require(root + 'config/winston')
 , assert = require('assert')
 , async = require('async')
 
 // global 
 sysLogger = winston.getSysLogger()
 
 function test_login(cb) { 
 	session.Singelton.getInstance().login(function(err, res){
 	assert(res.result.errorCode = 'OK', 'Login failed');
 	cb(err);
 });
 }

 function test_logout(cb)  {
 	session.Singelton.getInstance().logout(function(err, res){
 	assert(res.result.errorCode = 'OK', 'Lougout failed');
 	cb(err);
 });
 }
 
  
async.waterfall([test_login, test_logout], function(err,res) {
    console.log("Done, err =",err);
    process.exit(0);
});