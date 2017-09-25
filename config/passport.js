var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GitHubStrategy = require('passport-github2').Strategy;

var auth = require('./oauth');
var db = require('../db')

module.exports = function (passport) {

      // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.findUser(id, function(err, user) {
            done(err, user);
        });
    });


  passport.use(new GoogleStrategy({
    clientID:     auth.google.clientID,
    clientSecret: auth.google.clientSecret,
    //NOTE :
    //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
    //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ 
    //then edit your /etc/hosts local file to point on your private IP. 
    //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
    //if you use it.
    callbackURL: auth.google.callbackURL,
    passReqToCallback : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      

      db.findUser(profile.id, function (err,user) {
        
        if(err)
          return done(err)
        if(user)
          return done(null,user)
        else {
          db.createUser(profile.displayName,profile.id,accessToken, function (err,newUser) {
            if(err)
              throw err;
            else {
              return done(null,newUser);
            }
          })
        }

      });

    });
  }
));

    // Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: auth.github.clientID,
    clientSecret: auth.github.clientSecret,
    callbackURL: auth.github.callbackURL,
    passReqToCallback : true
  },
  function(request,accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      db.findUser(profile.id, function (err,user) {
        
        if(err)
          return done(err)
        if(user)
          return done(null,user)
        else {

          db.createUser(profile.username,profile.id,accessToken, function (err,newUser) {
            if(err)
              throw err;
            else return done(null,newUser);
          })
        }

      });
    });
  }
));



    
}



