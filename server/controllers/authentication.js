const jwt = require('jwt-simple');
const User  = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();

  // Info to encode and the secret to do it with.
  // By convention, jwt objects have a subject ("sub").
  // Also by convetion, jwt objects have an issued at time ("iat")
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // Need to give them a token.

  // Passport's done method provided the user to the callback so we can
  // access that from the request.
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(422).send({ error: "You must provide email and password" });
  }

  // See if user with a given email esists. In mongoose, all callbacks follow
  // the same patterm of callback(error, result)
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    // If a user with email does exist, return an error.
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does NOT exist, create and save record
    const user = new User ({
      email: email,
      password: password
    });

    // Commit the user to the database.
    user.save(function(err) {
      if (err) { return next(err); }

      // Respond to request indicating the user was created.
      res.json({ token: tokenForUser(user) });
    });
  });
};
