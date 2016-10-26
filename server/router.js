const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// session false means we are not making cookies.
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function(app) {

  // GET request to root route will require authentication.  Will need a
  // a valid token to advance.
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });
  app.post('/signup', Authentication.signup);
};
