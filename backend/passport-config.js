import User from './models/user'
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

passport.use(new Strategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.validatePassword(password)) { 
      	return done(null, false, {
      		message: "Password is wrong!"
      	}); 
      }
      //if everything checks out, return user
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id)
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

export default passport;