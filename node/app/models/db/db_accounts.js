/**
 * Store befair accounts
 * TODO: Use encryption
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AccountsSchema = new Schema({
    bfUsername: { type: String, required: true, index: { unique: true } },
    bfPassword: { type: String, required: true },
    active: {type: Boolean, required: true },
    id: {type: String, required: true}
    
});

module.exports = mongoose.model('Account', AccountsSchema, 'accounts');