
import { Schema } from "mongoose";
import { db } from "../../../modules/db/index.js";

export const AUTH_TYPE = {
  local: 1,
  oauth: 2,
}

const authSchema = new Schema({
  account_id: {
    type: Schema.Types.ObjectId,
    ref: "Account"
  },
  type: {
    type: String,
  },
  data: {
    type: Object
  }
});

export const Auth = db.model("Auth", authSchema);
