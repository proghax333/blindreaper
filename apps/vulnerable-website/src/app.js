import express from "express";
import passport from "passport";
import path from "node:path";

import mongoose from "mongoose";

import { authRouter } from "./features/auth/auth.router.js";
import { blogRouter } from "./features/blog/blog.router.js";

import { addSessionManager } from "./lib/iron-session.js";

async function main() {
  const app = express();
  const PORT = process.env.PORT || 5010;

  app.set("trust proxy", 1); // trust first proxy

  const STATIC_PATH = path.resolve("./src/public");

  app.use(express.static(STATIC_PATH));

  app.set("view engine", "ejs");
  app.set('views', path.resolve("./src/views"));

  app.use(express.urlencoded({ extended: true }));

  // Patch Render
  app.use((req, res, next) => {
    const render = res.render.bind(res);

    res.render = (view, context = {}) => {
      Object.assign(context, {
        auth: {
          user: req.user,
        }
      });

      return render(view, context);
    };

    next();
  })

  // Session Manager
  addSessionManager(app);

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/auth", authRouter);
  app.use("/", blogRouter);

  const connection = await mongoose.connect(process.env.mongodb_url);

  app.listen(PORT, () => {
    console.log(`Started server on port ${PORT}.`);
  });
}

main();
