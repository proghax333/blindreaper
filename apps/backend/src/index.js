
import { createContainer } from "./lib/di.js";
import AuthRouterFactory from "./modules/auth/auth.routes.js";

import express from "express";
import dotenv from "dotenv";

import AuthController from "./modules/auth/controllers/auth.controller.js";

import { HttpError } from "./lib/http.js";

import passport from "passport";
// import { ironSession } from "iron-session/express";
import { ironSession } from "./lib/iron-session.js";
import cors from "cors";
import nodemailer from "nodemailer";

// import mongoose, { Schema, Model } from "mongoose";

import { db } from "./modules/db/index.js";

async function main() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /* Initialize services */
  const factories = [
    // Load environment variables from
    // .env file in development environments 
    {
      name: "env",
      factory: () => {
        if(process.env.NODE_ENV !== "production") {
          dotenv.config();
        }
        
        return process.env;
      },
    },

    // Database connection
    {
      name: "db",
      dependencies: ["env"],
      factory: async ({ env }) => {
        env = env.instance;

        const uri = env.MONGODB_CONNECTION_URL;
        const connection = await db.openUri(uri);

        return connection;
      }
    },

    {
      name: "mail",
      dependencies: ["env"],
      factory: async ({ env }) => {
        env = env.instance;

        const mailer = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          auth: {
            user: env.MAIL_USERNAME,
            pass: env.MAIL_PASSWORD,
          },
        });
        
        // return mailer;

        return {
          sendMail(options) {
            return new Promise((resolve, reject) => {
              mailer.sendMail(options, (err, data) => {
                if(err) {
                  reject(err);
                } else {
                  resolve(data);
                }
              });
            });
          }
        };

        // return {
        //   sendMail
        // }
      }
    },

    // Express application
    {
      name: "app",
      factory: () => {
        return app;
      },
    },

    // Session middleware
    {
      name: "session",
      factory: async (modules) => {
        const app = modules.app.instance;

        const session = ironSession({
          cookieName: "br_session",
          password: process.env.SECRET_COOKIE_PASSWORD || "this is just some development cookie password",
          cookieOptions: {
            secure: process.env.NODE_ENV === "production",
          },
        });
        app.use(session);
        app.use((req, res, next) => {
          const session = req.session;

          req.session = {};
          req.session.regenerate = (fn) => {
            fn();
          }
          req.session.save = function(cb) {
            session.save()
              .then(cb)
              .catch(cb);
          };
          req.session.destroy = function(cb) {
            session.destroy();
            cb();
          };

          next();
        });

        return session;
      },
      dependencies: ["app"]
    },

    // Passport authentication system
    {
      name: "passport",
      factory: async (modules) => {
        const app = modules.app.instance;

        app.use(passport.initialize());
        app.use(passport.session());

        return passport;
      },
      dependencies: ["app", "session"],
    },

    // Auth module
    {
      name: "AuthRouter",
      factory: AuthRouterFactory,
      dependencies: ["app", "AuthController"],
    },
    {
      name: "AuthController",
      dependencies: ["passport", "db"],
      factory: AuthController
    },
  ];
  const container = createContainer();
  for(const factory of factories) {
    await container.register(factory);
  }

  
  app.post("/test", (req, res, next) => {
    return res.json({
      "ok": "OK"
    })
  });

  // Error 404 handler
  app.use((req, res, next) => {
    return res.json(HttpError(404, "Not found."));
  });

  // Error handler
  app.use((err, req, res, next) => {
    if(!err) {
      err = HttpError(500, "Something went wrong.");
    }
    
    return res.status(err.error.code).json(err);
  });


  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
  });
}

main()
  .catch(e => {
    console.error("Error occured: ", e);
  });
