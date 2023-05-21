
import { Router } from "express";

export default function PayloadsRouterFactory({ app, PayloadsController }) {
  app = app.instance;
  PayloadsController = PayloadsController.instance;

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

  return payloadsRouter;
}
