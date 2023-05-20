import { HttpError } from "../../../lib/http.js";

export function isLoggedIn(req, res, next) {
  if(req.user) {
    next();
  } else {
    next(HttpError(401, "User is not logged in."));
  }
}
