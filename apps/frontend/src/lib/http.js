
import axios from "axios";
import { reject, transformK } from "~/lib/utils";

import * as R from "ramda";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const select = (domain) => (responseBody) => {
  return responseBody.data.items.filter(item => {
    return item.domain === domain;
  });
};

export const filterDomain = (prop, domain) =>
  transformK(
    R.equals(prop),
    R.filter(R.propEq(domain, "domain"))
  );

export const filterItems = domain =>
  filterDomain("items", domain);

export const filterErrors = domain =>
  filterDomain("errors", domain);

export const handleSuccess = domain => async value => {
  const result = await filterItems(domain)(value.data.data);
  value.data.data = result;
  return value.data;
};

export const handleErrors = domain => async value => {
  const result = await filterErrors(domain)(value.response.data.error);
  value.response.data.error = result;
  return reject(value.response.data);
};

export function handleResponse(promise) {
  return promise
    .then(res => Response(res?.data, true, res))
    .catch(err => Response(err?.response?.data, false, err));
}

export function Response(dataOrError, isSuccess, raw) {
  dataOrError = dataOrError || {};

  let value = {
    data: null,
    error: null,
    ...dataOrError,
  };

  function first(list) {
    if(!list) {
      return null;
    }

    return list[0];
  }

  const result = {
    getRawValue() {
      return raw;
    },
    value,
    isSuccess,
    entriesByDomain(selector, domain) {
      const list = selector(value);
      if(list) {
        return list.filter(entry => entry.domain === domain);
      }
      return [];
    },
    itemsByDomain(domain) {
      return this.entriesByDomain(
        (value) => value.data?.items,
        domain
      );
    },
    errorsByDomain(domain) {
      return this.entriesByDomain(
        (value) => value.error?.items,
        domain
      );
    },
    itemByDomain(domain) {
      return first(this.itemsByDomain(domain));
    },
    errorByDomain(domain) {
      return first(this.errorsByDomain(domain));
    },
    getData() {
      return value.data;
    },
    getError() {
      return value.error;
    },
    hasError() {
      return !!value.error;
    },
    hasData() {
      return !!value.data;
    }
  };

  if(isSuccess) {
    return result;
  } else {
    throw result;
  }
}
