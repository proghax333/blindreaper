
import OAuth2Strategy, { InternalOAuthError } from "passport-oauth2";

import axios from "axios";
import util from "node:util";

export class ClerkStrategy extends OAuth2Strategy {
  constructor(options, verify) {
    super(options, verify);

    this._userProfileURL = options.userProfileURL;
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  async userProfile(accessToken, done) {
    try {
      const url = process.env.user_info_url;

      const response = await axios.get(url, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        }
      });

      const profile = response.data;

      return done(null, profile);
    } catch (error) {
      console.log(
        "Error: ",
        util.inspect(
          error.response.data,
          {showHidden: false, depth: null, colors: true}
        )
      );

      return done(new InternalOAuthError("Could not load the profile.", error.response.data));
    }
  }
}
