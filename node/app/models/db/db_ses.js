/**
* Amazon Simple Email Service:
* Used to store encrypted AWS Access Key to send mails. 
*/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('../../../util/bcryptlocal'),   // Change to bcrypt module if possible
    SALT_WORK_FACTOR = 10;

var AwsAccessSchema = new Schema({
    accesskey: { type: String, required: true, index: { unique: true } },
    secretkey: { type: String, required: true }
});

module.exports = mongoose.model('SES', AwsAccessSchema);
