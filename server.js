require('dotenv').load();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var methodOverride = require('method-override');
var path = require('path');
var db = require('./db');
var passport = require('passport');

db.init(function(err){
	if(err){
		console.log('Unable to connect to MongoDB');
		process.exit(1);
	}
	else {
		console.log('Connected to Database..');

		require('./config/passport')(passport)
		app.use(cookieParser()); // read cookies (needed for auth)
		app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(session({ secret: 'ilovecloudrecovery' , saveUninitialized: true, resave:true })); // session secret

        app.use(passport.initialize());
        app.use(passport.session()); // persistent login sessions
        app.use(express.static(path.join(__dirname, 'client/dist')));
        app.use(methodOverride());
        require('./routes.js')(app,passport);

        var port = process.env.PORT || 3000;

        app.listen(port, function() {
            console.log('Listening on port ' + port + '...');
        });
	}
});
