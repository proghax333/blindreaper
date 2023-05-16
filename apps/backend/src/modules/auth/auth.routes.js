
import { Router } from "express";

export default async function AuthRouterFactory(modules, config) {
  const router = Router();
  const AuthController = modules.AuthController.instance;

  router
    .get("/", AuthController["/"]);
  
  const app = modules.app.instance;
  app.use("/auth", router);

  return router;
}
