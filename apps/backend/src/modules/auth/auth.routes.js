
import { Router } from "express";

export default async function AuthRouterFactory(modules, config) {
  const router = Router();
  const AuthController = modules.AuthController.instance;

  router
    .get("/", AuthController["/"])
    .post("/login", AuthController["/login"])
    .get("/logout", AuthController["/logout"])
    .post("/forgot-password", AuthController["/forgot-password"])
    .post("/reset-password", AuthController["/reset-password"]);
  
  const app = modules.app.instance;
  app.use("/auth", router);

  return router;
}
