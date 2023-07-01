
import { Router } from "express";
import { blogController } from "./blog.controller.js";

export const blogRouter = Router();

blogRouter
  .get("/", ...blogController["[get]/"])
  .post("/comments/add", ...blogController["[post]/comments/add"])
  .post("/comments/delete", ...blogController["[post]/comments/delete"])
  ;
