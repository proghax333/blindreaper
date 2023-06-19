
import { Router } from "express";
import { authController } from "./auth.controller.js"

export const authRouter = Router();

authRouter
  .get("/clerk", ...authController["[get]/auth/clerk"])
  .get("/clerk/callback", ...authController["[get]/auth/clerk/callback"])
  .get("/logout", ...authController["[get]/auth/logout"])
  ;
