
import { db } from "../../db/index.js";
import { Schema } from "mongoose";

const accountSchema = new Schema({
  name: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: "",
  },
  key: {
    type: String,
    default: null
  }
});

export const Account = db.model("Account", accountSchema);
