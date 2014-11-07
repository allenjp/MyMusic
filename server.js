// server.js

// BASE SETUP
// ============================================================================

// call our packages
var express = require('express');
var app = express();

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var configDB = require('./config/database.js');

// set the port
var port = process.env.PORT || 8882;

// Mongoose config
mongoose.connect(configDB.url);

require('./config/passport')(passport); // pass passport for configuration

// set up express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth);
app.use(bodyParser()); // get info from html forms
app.use(methodOverride()); // override form methods so we can use put requests

// configure app to use our stylesheets and scripts
app.use(express.static(__dirname + '/app/frontend'));

// required for passport
app.use(session({ secret: 'testSecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored in session

// ROUTES
require('./app/routes.js')(app, passport); // load routes and pass in our app & fully config'd password

// Start the server
// ============================================================================
app.listen(port);
console.log('Operating on port ' + port);