// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

// load email client
var nodemailer = require('nodemailer');

// create reusable email transporter object
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'jeffreypallen3@gmail.com',
		pass: 'Woky669.'
	}
});

// expose this function to our app using module.exports
module.exports = function(passport) {

	/*
	* PASSPORT SESSION SETUP
	*
	* required for persistent login sessions
	* passport needs ability to serialize / unserialize users out of session
	*/

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	/* LOCAL SIGNUP
	*
	* we are using named strategies since we have one for login and one for signup
	* by default, if there was no name, it would just be called 'local'
	*/

	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and passowrd
		// we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) {
		// asynchronous
		// User.findOne won't fire unless data is sent back
		process.nextTick(function() {
			// find a user whose email is the same as the form's email
			// we are checing to see if the user trying to signup already exists
			User.findOne({ 'local.email' : email }, function(err, user) {
				// if there are any errors, return the error
				if (err) {
					return done(err);
				}

				// check to see if there's already a user with that email
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				}
				// make sure password is confirmed correctly 
				else if (req.body.password != req.body.confirm) {
					return done(null, false, req.flash('signupMessage', 'Make sure passwords match.'));
				} 
				else {
					// if there is no user with that email
					// create the user
					var newUser = new User();

					// set the user's local credentials
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.local.username = req.body.username;
					newUser.local.avatar = "/img/empty_avatar.jpg";
					newUser.local.isAdmin = false;

					// save the user
					newUser.save(function(err) {
						if (err) {
							throw err;
						}
						var mailOptions = {
							from: 'jeffreypallen3@gmail.com',
							to: newUser.local.email,
							subject: 'Welcome to the super cool blog',
							text: 'Hey, thanks for signing up.  Enjoy the site!'
						};

						transporter.sendMail(mailOptions, function(err, info) {
							if(err) {
								console.log(err);
							} else {
								console.log('Message sent: ' + info.response);
							}
						});
						return done(null, newUser);
					});
				}
			});
		});
	}));

	/* LOCAL LOGIN
	*
	* we are using named strategies since we have one for login and one for signup
	* by default, if there was no name, it would just be called 'local'
	*/

	passport.use('local-login', new LocalStrategy({

		// by default, local strategy uses username and passowrd
		// we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) { // callback with email and password from our form

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		User.findOne({ 'local.email' : email }, function(err, user) {
			// if there are any errors, return the error before anything else
			if (err) {
				return done(err);
			}

			// if no user is found, return the message
			if (!user) {
				return done(null, false, req.flash('loginMessage', 'Email not found.'));
			}

			// if the user is found but the password is wrong
			if (!user.validPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
			}

			// all is well, return successful user
			return done(null, user);
		});
	}));
};