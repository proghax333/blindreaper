
import LocalStrategy from "passport-local";
import { HttpError, HttpData, HttpResponse, handleError } from "../../../lib/http.js";
import { Account } from "../../account/models/account.model.js";
import { AUTH_TYPE, Auth } from "../models/auth.model.js";

import crypto from "crypto";

export default function AuthController({ env, passport, db, mail }) {
  passport = passport.instance;
  db = db.instance;
  mail = mail.instance;
  env = env.instance;

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
        // console.log({
        //   err,
        //   user,
        //   info,
        //   status
        // });
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(HttpError(500, "Could not login."));
        }

        req.login(user, (err) => {
          // console.log("Login error: ", err);
          // console.log("Session: ", JSON.stringify(req.session));

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
        // console.log("Error", e);
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
        
        const link = `${env.WEB_BASE_URL}/reset-password/${code}`;

        for(let i = 0; i < 3; ++i) {
          try {
            await mail.sendMail({
              from: "atmanandnagpure31@gmail.com",
              to: email,
              subject: "Password Reset | BlindReaper",
              html: getPasswordResetPage(link),
            });
            success = true;
            break;
          } catch (e) {
            // console.log("Mail error: ", e);
          }
        }

        if(success) {
          return res.send(HttpData({
            items: [{
              domain: "auth",
              message: "Password reset link has been sent.",
            }]
          }));
        }
      } catch (e) {
        // console.log("Email error: ", e);
      }

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

function getPasswordResetPage(link) {
  return `
  <!doctype html>
  <html lang="en-US">
  
  <head>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <title>Reset Password Email Template</title>
      <meta name="description" content="Reset Password Email Template.">
      <style type="text/css">
          a:hover {text-decoration: underline !important;}
      </style>
  </head>
  
  <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
      <!--100% body table-->
      <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
          style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
          <tr>
              <td>
                  <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                      align="center" cellpadding="0" cellspacing="0">
                      <tr>
                          <td style="height:80px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td>
                              <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                  style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                  <tr>
                                      <td style="height:40px;">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="padding:0 35px;">
                                          <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                              requested to reset your password</h1>
                                          <span
                                              style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                          <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                              We cannot simply send you your old password. A unique link to reset your
                                              password has been generated for you. To reset your password, click the
                                              following link and follow the instructions.
                                          </p>
                                          <a href="${link}"
                                              style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                              Password</a>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="height:40px;">&nbsp;</td>
                                  </tr>
                              </table>
                          </td>
                      <tr>
                          <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td style="text-align:center;">
                              <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>blindrepear.proghax333.co.in</strong></p>
                          </td>
                      </tr>
                      <tr>
                          <td style="height:80px;">&nbsp;</td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
      <!--/100% body table-->
  </body>
  
  </html>`;
}
