
import { Router } from "express";
import { authController } from "./blog.controller.js";

export const blogRouter = Router();

blogRouter
  .get("/", ...authController["[get]/"])
  .post("/", ...authController["[post]/"])
  ;
