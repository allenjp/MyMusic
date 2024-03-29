// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
	local : {
		email : String,
		username : String,
		password : String,
		avatar : String,
		isAdmin : Boolean
	}
});

// METHODS
// generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if pass is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// create model for users and expose it to the app
module.exports = mongoose.model('User', userSchema);