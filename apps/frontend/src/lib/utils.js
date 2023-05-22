
export const reject = (value) => {
  if(typeof value === "function") {
    return (...args) => {
      return Promise.reject(value(...args));
    };
  }

  return Promise.reject(value);
}

export const transformK = (keyFn, transformer) => data => {
  if(!data) return data;

  // Make copy
  data = {
    ...data,
  };

  const defaultTransformer = data => data;
  transformer = transformer || defaultTransformer;

  for(const [key, value] of Object.entries(data)) {
    if(data[key] && keyFn(key)) {
      data[key] = transformer(data[key]);
    }
  }

  return data;
}

export const wait = ms => new Promise((resolve, reject) => {
  setTimeout(() => resolve(ms), ms);
});
