
import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  }
}, {
  timestamps: true,
});

export const Post = mongoose.model("Post", PostSchema);


const CommentSchema = new Schema({
  // postId: {
  //   type: Schema.Types.ObjectId
  // },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  content: {
    type: String,
  }
}, {
  timestamps: true,
});

export const Comment = mongoose.model("Comment", CommentSchema);
