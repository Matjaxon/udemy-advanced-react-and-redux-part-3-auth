const User  = require('../models/user');

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
      res.json({ success: "true" });
    });
  });
};
