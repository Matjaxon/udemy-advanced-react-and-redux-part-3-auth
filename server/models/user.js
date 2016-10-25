// Local definition of what a user is for Mongoose and MongoDB.  To run
// MongoDB database run "mongod" in the command line.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model.  Define the types for the table.  Pass type in
// as an object to add the unique property.
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On Save Hook, encrypt password.
// Before saving a model, run this function (pre-save event)
UserSchema.pre('save', function(next) {

  // Get access to the user model.
  const user = this;

  // Generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // Hash password using the salt.
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }

      // Overwrite plain text password with encrypted.
      user.password = hash;
      next();
    });
  });
});

// Create model class
const ModelClass = mongoose.model('user', UserSchema);

// Export the model
module.exports = ModelClass;
