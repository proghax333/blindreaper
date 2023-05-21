
import { Router } from "express";

export default function PayloadsRouterFactory(
  {
    app,
    PayloadsController,
    ScriptController,
  }
) {
  app = app.instance;
  PayloadsController = PayloadsController.instance;
  ScriptController = ScriptController.instance;

  const payloadsRouter = Router();

  payloadsRouter
    .get("/", ...PayloadsController["/"])
    .post("/", ...PayloadsController["/create_payload"])
    .put("/:id", ...PayloadsController["/update_payload"])
    .delete("/:id", ...PayloadsController["/delete_payload"])
    
    .get("/:id/captures", ...PayloadsController["/get_captures"])
    .post("/:id/captures", ...PayloadsController["/create_capture"])
    .get("/captures/:id", ...PayloadsController["/get_capture"])
    .delete("/captures/:id", ...PayloadsController["/delete_capture"])

  app.use("/payloads", payloadsRouter);

  
  const scriptRouter = Router();
  scriptRouter
    .get("/:id", ...ScriptController["/get-capture-script"]);

  app.use("/use", scriptRouter);

  return payloadsRouter;
}
