const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const UserSchema = require('../models/usersModel');

passport.serializeUser((user, done) => {
    done(null, user.id);

});
  
  passport.deserializeUser(async (id, done) => {
    const user = await UserSchema.findById(id);

    done(null, user);
});

passport.use('signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {

    let user = await UserSchema.findOne({'username': username});

    if(!user) {
      return done(null, false);
    }

    if(user.password !== password) {
      return done(null, false);
    }


    return done(null, user);

  }));