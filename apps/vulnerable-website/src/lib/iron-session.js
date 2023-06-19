import { getIronSession } from "iron-session";

export function getPropertyDescriptorForReqSession(
  session,
) {
  return {
    enumerable: true,
    writable: true,
    value: session
    /*get() {
      return session;
    },
    set(value) {
      const keys = Object.keys(value);
      const currentKeys = Object.keys(session);

      currentKeys.forEach((key) => {
        if (!keys.includes(key)) {
          // @ts-ignore See comment in IronSessionData interface
          delete session[key];
        }
      });

      keys.forEach((key) => {
        // @ts-ignore See comment in IronSessionData interface
        session[key] = value[key];
      });
    },*/
  };
}

export function ironSession(
  sessionOptions,
) {
  return async function ironSessionMiddleware(req, res, next) {
    const session = await getIronSession(req, res, sessionOptions);
    Object.defineProperty(
      req,
      "session",
      getPropertyDescriptorForReqSession(session),
    );

    next();
  };
}

export function addSessionManager(app) {
  const session = ironSession({
    cookieName: "vw_session",
    password: process.env.SECRET_COOKIE_PASSWORD || "this is just some development cookie password",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      httpOnly: true,
    },
  });
  app.use(session);
  app.use((req, res, next) => {
    const sess = req.session;

    req.session = {
      ...sess,
    };
    req.session.regenerate = (fn) => {
      fn();
    }
    req.session.save = function(cb) {
      const {save, destroy, ...value} = req.session;

      const keys = Object.keys(value);
      const currentKeys = Object.keys(sess);

      currentKeys.forEach((key) => {
        if (!keys.includes(key)) {
          // @ts-ignore See comment in IronSessionData interface
          delete sess[key];
        }
      });

      keys.forEach((key) => {
        // @ts-ignore See comment in IronSessionData interface
        sess[key] = value[key];
      });

      sess.save()
        .then(cb)
        .catch(cb);
    };
    req.session.destroy = function(cb) {
      sess.destroy();
      cb();
    };

    next();
  });
}

