import { Payload } from "../models/payload.model.js";

export default function ScriptController({ env, PayloadScript }) {
  PayloadScript = PayloadScript.instance;
  env = env.instance;

  return {
    "/get-capture-script": [
      async (req, res, next) => {
        let { id } = req.params;
        id = id || "";

        if(id) {
          const payload = await Payload.findById(id);
          
          if(payload.active) {
            const script = PayloadScript.generateScript(`${env.BASE_URL}/payloads/${id}/captures`);
            res.setHeader("content-type", "text/javascript");
            
            return res.send(script);
          }
        }

        res.setHeader("content-type", "text/javascript");
        return res.send("");
      }
    ]
  }
}