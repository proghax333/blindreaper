
import { createContainer } from "./lib/di.js";
import AuthRouterFactory from "./modules/auth/auth.routes.js";

import express from "express";
import AuthController from "./modules/auth/controllers/auth.controller.js";

async function main() {
  const app = express();

  /* Initialize services */
  const factories = [
    {
      name: "app",
      factory: () => {
        return app;
      },
    },
    {
      name: "AuthRouter",
      factory: AuthRouterFactory,
      dependencies: ["app", "AuthController"],
    },
    {
      name: "AuthController",
      factory: AuthController
    },
  ];

  const container = createContainer();

  for(const factory of factories) {
    await container.register(factory);
  }

  // console.log(Object.entries(container.services).map(([, {instance, ...rest}]) => rest));

  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
  })
}

main();
