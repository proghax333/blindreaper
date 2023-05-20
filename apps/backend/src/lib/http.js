
// import HTTPErr from "standard-http-error";

/*
object {
  string apiVersion?;
  string context?;
  string id?;
  string method?;
  object {
    string id?
  }* params?;
  object {
    string kind?;
    string fields?;
    string etag?;
    string id?;
    string lang?;
    string updated?; # date formatted RFC 3339
    boolean deleted?;
    integer currentItemCount?;
    integer itemsPerPage?;
    integer startIndex?;
    integer totalItems?;
    integer pageIndex?;
    integer totalPages?;
    string pageLinkTemplate /^https?:/ ?;
    object {}* next?;
    string nextLink?;
    object {}* previous?;
    string previousLink?;
    object {}* self?;
    string selfLink?;
    object {}* edit?;
    string editLink?;
    array [
      object {}*;
    ] items?;
  }* data?;
  object {
    integer code?;
    string message?;
    array [
      object {
        string domain?;
        string reason?;
        string message?;
        string location?;
        string locationType?;
        string extendedHelp?;
        string sendReport?;
      }*;
    ] errors?;
  }* error?;
}*;
*/

export function HttpError(
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
    ...(errors ? {errors}: {})
  };

  return {
    error
  };
}

export function HttpData(data) {
  return {
    data,
  };
}

export function HttpResponse(data, error, extras = {}) {
  const result = {
    ...(error ? HttpError(error.code, error.message, error.errors) : {}),
    ...(data ? HttpData(data) : {}),
    ...extras
  };

  return result;
}

export function handleError(next, e, message = "Something went wrong.") {
  if(typeof e === "object" && e?.error?.code) {
    next(e);
  } else {
    next(HttpError(500, message));
  }
}
