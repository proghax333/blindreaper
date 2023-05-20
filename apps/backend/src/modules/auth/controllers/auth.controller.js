
import LocalStrategy from "passport-local";
import { HttpError, HttpData, HttpResponse, handleError } from "../../../lib/http.js";
import { Account } from "../../account/models/account.model.js";
import { AUTH_TYPE, Auth } from "../models/auth.model.js";

import crypto from "crypto";

export default function AuthController({ passport, db, mail }) {
  passport = passport.instance;
  db = db.instance;
  mail = mail.instance;

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
          console.log(err);
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
      const { email } = req.body;

      const sendServerError = () => next(HttpError(500, "Could not send reset link"));

      let auth = null;

      try {
        auth = await Auth.findOne({
          type: AUTH_TYPE.local,
          "data.email": email,
        });

        if(!auth) {
          return next(HttpError(401, "Could not find account with the email."));
        }
      } catch (e) {
        return sendServerError();
      }

      try {
        let success = false;

        let code = crypto.randomBytes(32).toString("hex");

        // Save code for verification
        const result = await Auth.findOneAndUpdate(
          {
            _id: auth._id,
            "data.email": email,
          },
          {
            "reset_code": code,
          },
          {
            new: true,
          }
        );

        for(let i = 0; i < 3; ++i) {
          try {
            await mail.sendMail({
              from: "atmanandnagpure31@gmail.com",
              to: email,
              subject: "Test Mail",
              // text: "Plaintext version of the message",
              html: "<p>HTML version of the message</p>",
            });
            success = true;
            break;
          } catch (e) { }
        }

        if(success) {
          return res.send(HttpData({
            items: [{
              domain: "auth",
              message: "Password reset link has been sent.",
            }]
          }));
        }
      } catch (e) { }

      return sendServerError();
    },

    "/reset-password": async (req, res, next) => {
      const { code, email, password } = req.body;

      try {
        const auth = await Auth.findOne({
          "data.email": email,
        });

        if(!auth) {
          throw HttpError(401, "Incorrect email address.");
        }

        if(auth.reset_code !== code) {
          throw HttpError(403, "The reset code has expired.");
        }

        auth.reset_code = undefined;
        auth.data = {
          ...auth.data,
          password,
        };
        
        await auth.save();

        return res.json(HttpData({
          items: [{
            domain: "auth",
            message: "Password was updated successfully!",
          }]
        }));
      } catch (e) {
        handleError(next, e, "Could not reset the password");
      }
    }
  };
}
