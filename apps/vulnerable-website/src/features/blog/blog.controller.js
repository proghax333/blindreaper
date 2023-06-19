
import { isAuthenticated } from "../auth/auth.middleware.js";
import { Comment } from "./blog.model.js";

export const authController = {
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
  "[post]/": [
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
};
