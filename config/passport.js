const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, { id: user._id, type: user.type });
  });

  passport.deserializeUser(async (obj, done) => {
    try {
      const user = await User.findById(obj.id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
};
