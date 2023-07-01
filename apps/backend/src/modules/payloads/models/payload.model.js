
import { Schema } from "mongoose";
import { db } from "../../db/index.js";

import { paginatorPlugin } from "../../../lib/mongoose-utils.js";

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
  },
  active: {
    type: Boolean,
    default: true,
  }
});

payloadSchema.plugin(paginatorPlugin);

export const Payload = db.model("Payload", payloadSchema);
