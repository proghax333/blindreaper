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