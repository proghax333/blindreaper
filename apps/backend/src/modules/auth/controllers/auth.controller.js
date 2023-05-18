
import LocalStrategy from "passport-local";
import HttpError from "../../../lib/http-errors.js";

export default function AuthController({ passport, db }) {
  passport = passport.instance;
  db = db.instance;

  passport.use("local", new LocalStrategy(
    {
      usernameField: "login",
      passwordField: "password",
      passReqToCallback: "true"
    },
    function(req, login, password, cb) {
      cb(null, {
        login
      });
    }
  ));

  return {
    "/": async (req, res, next) => {
      return res.send({
        status: "success"
      });
    },
    "/login": async (req, res, next) => {
      passport.authenticate('local', function(err, user, info, status) {
        // console.log({
        //   err,
        //   user,
        //   info,
        //   status,
        // });

        if (err) { return next(err); }
        if (!user) { return next(next(HttpError(400, "Data not supplied."))); }
        
        return res.json({
          status: "ok"
        });
      })(req, res, next);


      /*    app.get('/protected', function(req, res, next) {
      *       passport.authenticate('local', function(err, user, info, status) {
      *         if (err) { return next(err) }
      *         if (!user) { return res.redirect('/signin') }
      *         res.redirect('/account');
      *       })(req, res, next);
      *     });
      */
    },
    "/logout": async (req, res, next) => {

    },
    "/forgot-password": async (req, res, next) => {
      
    },
    "/reset-password": async (req, res, next) => {

    }
  };
}
