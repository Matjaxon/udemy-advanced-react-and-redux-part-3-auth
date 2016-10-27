const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify the email and password.  Call done if correct with user.
  // Otherwise call done with false.
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }

    // If no user found return out.
    if (!user) { return done(null, false); }

    // compare passwords - is 'password' equal to user.password.
    // Need to decode the salted password string.
    user.comparePasswords(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy.  Check the request headers for a header
// called authorization.
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy.  Payload is user_id and timestamp from server.
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {

  // If we find user, pass result to done.  Otherwise call with no argumets.
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});


// Tell passport to use this strategy.
passport.use(jwtLogin);
passport.use(localLogin);
