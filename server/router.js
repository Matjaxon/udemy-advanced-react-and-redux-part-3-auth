const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// session false means we are not making cookies.
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {

  // GET request to root route will require authentication.  Will need a
  // a valid token to advance.
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });

  // requireSignin is a middleware and will try to authenticate the user
  // before hitting the route handler
  app.post('/signin', requireSignin, Authentication.signin);

  app.post('/signup', Authentication.signup);
};
