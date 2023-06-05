
import { Schema } from "mongoose";
import { db } from "../../../modules/db/index.js";

export const AUTH_TYPE = {
  local: 1,
  oauth: 2,
};

export const AUTH_STATUS = {
  INITIAL: 1,
  ACTIVE: 2,
  INACTIVE: 4,
  DELETED: 8,
};

const authSchema = new Schema({
  account_id: {
    type: Schema.Types.ObjectId,
    ref: "Account"
  },
  type: {
    type: Number,
  },
  data: {
    type: Object
  },
  reset_code: {
    type: String,
  },
  activation_code: {
    type: String,
  },
  status: {
    type: Number,
  }
});

export const Auth = db.model("Auth", authSchema);
