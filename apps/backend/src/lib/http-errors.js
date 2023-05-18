
import HTTPErr from "standard-http-error";

export default function HttpError(
  code,
  message,
  errors
) {
  // Set error details
  code = code || 500;
  message = message || "Something went wrong.";

  // const error = new HTTPErr(code, message, errors || {});

  const error = {
    code,
    message,
    ...(errors || {})
  };

  return error;
}
