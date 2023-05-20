
import LocalStrategy from "passport-local";
import { HttpError, HttpData, HttpResponse } from "../../../lib/http.js";
import { Account } from "../../profiles/models/account.model.js";
import { AUTH_TYPE, Auth } from "../models/auth.model.js";

export default function AuthController({ passport, db }) {
  passport = passport.instance;
  db = db.instance;

  passport.use("local", new LocalStrategy(
    {
      usernameField: "login",
      passwordField: "password",
    },
    async function(login, password, cb) {
      try {
        const auth = await Auth.findOne({
          type: AUTH_TYPE.local,
          "data.email": login,
        });

        if(auth) {
          if(auth.data.password === password) {
            const account = await Account.findOne({
              _id: auth.account_id,
            });

            if(account) {
              return cb(null, {
                id: account._id,
              });
            }
          } else {
            return cb(HttpError(401, "Invalid username/password entered."));
          }
        } else {
          return cb(HttpError(401, "Account does not exist."));
        }
      } catch (e) {
        // console.log("Login error: ", e);
      }

      return cb(null, false);
    }
  ));

  // User -> Session Data
  passport.serializeUser(async function(user, cb) {
    cb(null, { id: user.id });
  });
  
  // Session Data -> User
  passport.deserializeUser(async function(user, cb) {
    const account = await Account.findOne({
      _id: user.id,
    });

    if(account) {
      cb(null, {
        id: account._id,
      });
    } else {
      cb(new Error("Something went wrong"));
    }
  });

  return {
    "/": async (req, res, next) => {
      return res.send({
        status: "success"
      });
    },
    "/register": async (req, res, next) => {
      const { email, name, password } = req.body;

      const sendServerError = () => {
        return next(HttpError(500, "Account could not be created."));
      }

      // Try to find if auth exists with the same email
      try {
        const auth = await Auth.findOne({
          "data.email": email,
        });

        if(auth) {
          return next(HttpError(
            400,
            "Account already exists",
            [
              {
                domain: "account",
                message: `Account with email address ${email} already exists.`
              }
            ]
          ));
        }
      } catch (e) {
        return sendServerError();
      }

      await Account.create({
        name,
      })
        // Account created successfully
        .then(async createdAccount => {

          await Auth.create({
            type: AUTH_TYPE.local,
            account_id: createdAccount._id,
            data: {
              email,
              password
            }
          })
            // Auth created successfully
            .then(async createdAuth => {
              return res.send(HttpResponse());
            })
            // Auth creation failed
            .catch(async error => {
              await Account.deleteOne({
                _id: createdAccount._id
              });

              return sendServerError();
            })
        })
        // Account creation failed
        .catch(error => {
            return sendServerError();
        })
    },

    "/login": async (req, res, next) => {
      passport.authenticate('local', function(err, user, info, status) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(HttpError(500, "Could not login."));
        }


        // return res.json({});
        req.login(user, (err) => {
          return res.json(HttpData({
            items: [{
              domain: "auth",
              message: "Logged in successfully!",
            }]
          }));
        });
      })(req, res, next);
    },
    "/logout": async (req, res, next) => {
      return req.session.destroy(() => {
        return res.json(HttpData({
          items: [{
            domain: "auth",
            message: "Logged out successfully.",
          }]
        }))
      });
    },
    "/forgot-password": async (req, res, next) => {
      
    },
    "/reset-password": async (req, res, next) => {

    }
  };
}
