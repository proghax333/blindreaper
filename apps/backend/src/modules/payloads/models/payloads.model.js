
import { Schema } from "mongoose";
import { db } from "../../../modules/db/index.js";

const payloadSchema = new Schema({
  name: {
    type: String,
  },
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: "Payload"
  }
});

export const Payload = db.model("Payload", payloadSchema);
