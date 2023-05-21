
import { Schema } from "mongoose";
import { db } from "../../db/index.js";

import { paginatorPlugin } from "../../../lib/mongoose-utils.js";

const captureSchema = new Schema({
  payload_id: {
    type: Schema.Types.ObjectId,
  },
  data: {
    type: Object,
  },
});

captureSchema.plugin(paginatorPlugin);

export const Capture = db.model("Capture", captureSchema);
