// app/routes.js
module.exports = function(app, passport) {

	// initialize Review
	var Review = require('../app/models/reviews');
	var Comment = require('../app/models/reviews');

	// HOME PAGE
	app.get('/', function(req, res) {
		res.render('index.ejs', {
			user: req.user
		});
	});

	// LOGIN
	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	// SIGNUP
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// PROFILE
	// protect this so you have to be logged in to visit
	// route middleware to verify this (isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of the session and pass to template
		});
	});

	// create put request so user can update their info
	app.put('/profile', isLoggedIn, function(req, res) {
		var user = req.user;
		user.local.avatar = req.body.avatar;
		user.save(function(err) {
			if(err) {
				res.send(err);
			}
			res.render('profile.ejs', {
				user : req.user
			});
		});
	});

	// LOGOUT
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// REVIEWS
	app.get('/reviews', function(req, res) {
		res.render('reviews.ejs', {
			user : req.user
		});
	});

	app.get('/reviews/:review_id', function(req, res){
		Review.findById(req.params.review_id, function(err, review) {
			if (err) {
				res.send(err);
			}
			if (review) {
				res.render('review_indiv.ejs', {
					user : req.user
				});
			}
			else {
				res.redirect('/reviews');
			}
		});
	});

	app.put('/reviews/:review_id', isLoggedIn, function(req, res){
		console.log('reached findById');
		Review.findById(req.params.review_id, function(err, review) {
			if (err) {
				res.send(err);
			}
			var user = req.user;

			review.comment.datePosted = new Date();
			review.comment.user = user;
			review.comment.content = req.body.comment-content;
			review.comment.votes = 0;
			review.comment.review_id = req.params.review_id;

			review.save(function(err) {
				if(err) {
					res.send(err);
				}
				res.json({message: 'comment posted successfully'});
			});
		});
	});

	app.get('/data/reviews', function(req, res) {
		Review.find(function(err, reviews) {
			if (err) {
				res.send(err);
			}
			res.json(reviews);
		});
	});

	app.get('/data/reviews/:review_id', function(req, res) {
		Review.findById(req.params.review_id, function(err, review) {
			if (err) {
				res.send(err);
			}
			res.json(review);
		});
	});

	app.get('/admin/reviews', isAdmin, function(req, res) {
		res.render('reviews-admin.ejs', {
			user : req.user
		});
	});

	app.post('/admin/reviews', isAdmin, function(req, res) {
		var review = new Review();
		review.datePosted = new Date();
		review.artist = req.body.artist;
		review.album = req.body.album;
		review.content = req.body.content;
		review.rating = req.body.rating;
		review.cover = req.body.cover;
		review.intro = req.body.intro;

		review.save(function(err) {
			if(err) {
				res.send(err);
			}
			res.json({ message: 'review posted successfully' });
		});
	});
};

// route middleware to make sure user is logged in
function isLoggedIn(req, res, next) {
	// if user is logged in / authenticated, carry on
	if (req.isAuthenticated()) {
		return next();
	}

	// if they aren't, redirect to home
	res.redirect('/');
}

// see if user is an admin
function isAdmin(req, res, next) {
	if (req.isAuthenticated() && req.user.local.isAdmin) {
		return next();
	}
	res.redirect('/');
}