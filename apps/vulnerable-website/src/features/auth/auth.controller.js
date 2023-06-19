
import passport from "passport";
import { ClerkStrategy } from "../../lib/passport-clerk.js";

import { User } from "./auth.model.js";

passport.use("clerk", new ClerkStrategy({
  authorizationURL: process.env.authorize_url,
  tokenURL: process.env.token_fetch_url,
  userProfileURL: process.env.user_info_url,
  clientID: process.env.client_id,
  clientSecret: process.env.client_secret,
  callbackURL: process.env.callback_url,
  scope: ['profile', 'email'],
},
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({
      user_id: profile.user_id,
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
    }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user._id,
      user_id: user.user_id,
      name: user.name,
      picture: user.picture,
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

export const authController = {
  "[get]/auth/clerk": [
    passport.authenticate('clerk')
  ],
  "[get]/auth/clerk/callback": [
    function (req, res, next) {
      passport.authenticate('clerk', (err, user, info, status) => {
        req.login(user, (err) => {
          return res.redirect("/");
        })
      })(req, res, next);
    }
  ],
  "[get]/auth/logout": [
    (req, res, next) => {
      req.logout((err) => {
        return res.redirect("/");
      });
    }
  ]
};
