
import { Router } from "express";

export default async function AccountRouterFactory(modules, config) {
  const router = Router();
  const AccountController = modules.AccountController.instance;

  router
    .get("/", ...AccountController["/"])
    .put("/update-details", ...AccountController["/update-details"])
  
  const app = modules.app.instance;
  app.use("/account", router);

  return router;
}
