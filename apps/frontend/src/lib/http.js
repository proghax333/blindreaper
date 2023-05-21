
import axios from "axios";
import { reject, transformK } from "~/lib/utils";

import * as R from "ramda";

export const api = axios.create({
  baseURL: 'http://localhost:5001',
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

export const handleErrors = fn => async value => {
  return reject(await fn(value.response.data));
}
