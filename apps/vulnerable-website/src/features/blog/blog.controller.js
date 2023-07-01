
import { isAuthenticated } from "../auth/auth.middleware.js";
import { Comment } from "./blog.model.js";

export const blogController = {
  "[get]/": [
    async (req, res, next) => {
      const comments = await Comment.find({})
        .sort({ _id: -1 })
        .populate("author")
        .exec();

      return res.render("pages/index", {
        data: {
          comments,
        }
      });
    }
  ],
  "[post]/comments/add": [
    isAuthenticated,
    async (req, res, next) => {
      const { comment } = req.body;
      const { id } = req.user;

      await Comment.create({
        author: id,
        content: comment,
      });

      return res.redirect("/");
    }
  ],
  "[post]/comments/delete": [
    isAuthenticated,
    async (req, res, next) => {
      const { commentId } = req.body;

      const comment = await Comment.findOne({
        _id: commentId,
      });

      if(comment.author._id.toString() !== req.user.id) {
        // handle error.
      } else {
        await comment.deleteOne();
      }

      return res.redirect("/");
    }
  ]
};
