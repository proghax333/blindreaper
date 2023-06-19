
import mongoose, { Schema } from "mongoose";
import findOrCreate from "mongoose-findorcreate";

const UserSchema = new Schema({
  user_id: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  picture: {
    type: String,
  }
}, {
  timestamps: true,
});

UserSchema.plugin(findOrCreate);

export const User = mongoose.model("User", UserSchema);
