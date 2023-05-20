
import { HttpData, HttpError, handleError } from "../../../lib/http.js";
import { isLoggedIn } from "../../auth/middlewares/auth.middleware.js";
import { Account } from "../models/account.model.js";

export default async function AccountController({ }) {
  return {
    "/": [
      isLoggedIn,
      async (req, res, next) => {
        try {
          const account = await Account.findById(req.user.id);
          if(account) {
            return res.json(HttpData({
              items: [{
                domain: "account",
                message: "Data retrieved successfully.",

                account: {
                  id: account._id,
                  name: account.name,
                  description: account.description,
                },
              }]
            }));
          } else {
            return next(HttpError());
          }
        } catch (e) {
          console.log(e);
          handleError(next, e, "Could not retrieve account details.");
        }
      }
    ],

    "/update-details": [
      isLoggedIn,
      async (req, res, next) => {
        try {
          const { name, description, key } = req.body;

          const result = await Account.updateOne(
            {
              _id: req.user.id,
            },
            {
              name,
              description,
              key,
            },
            { new: true }
          );

          return res.json(HttpData({
            items: [{
              domain: "account",
              message: "Account data updated successfully."
            }]
          }));
        } catch (e) {
          handleError(next, e, "Could not update account data.");
        }
      }
    ]

  };
}
