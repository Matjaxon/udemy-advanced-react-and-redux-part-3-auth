// Local definition of what a user is for Mongoose and MongoDB

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model.  Define the types for the table.  Pass type in
// as an object to add the unique property.
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// Create model class
const ModelClass = mongoose.model('user', UserSchema);

// Export the model
module.exports = ModelClass;
