// app/models/music-review.js
// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// define the schema for our user model
var CommentSchema = new Schema({
	datePosted : Date,
	user : String,
	content : String,
	votes : Number,
	review_id : String
});

var ReviewSchema = new Schema({
	datePosted : Date,
	artist : String,
	album : String,
	intro : String,
	content : String,
	rating : Number,
	cover : String,
	comments : [CommentSchema]
});

// create model for review and expose it to the app
module.exports = mongoose.model('Review', ReviewSchema);
module.exports = mongoose.model('Comment', CommentSchema);