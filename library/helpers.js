require("es6-promise").polyfill();
require("cross-fetch/polyfill");

const baseUrl = "https://api.trello.com";

const constructPutRequest = (method, baseUrl, path, key, token, options) => {
  if (!options) return { url: `${baseUrl}${path}`, method };

  const queryString = `?key=${key}&token=${token}`;
  const keys = Object.keys(options);
  const values = Object.values(options);
  const additionalQueries = keys
    .map((key, index) => `&${key}=${values[index]}`)
    .join("");

  return {
    url: `${baseUrl}${path}${queryString}${additionalQueries}`,
  };
};

const constructPostRequest = (method, baseUrl, path, key, token, options) => {
  if (path.includes("webhook")) {
    return {
      url: `https://api.trello.com/1/tokens/${token}/webhooks/`,
      method,
      data: { key, ...options },
    };
  }

  return {
    url: `${baseUrl}${path}`,
    method,
    data: { ...options, key, token },
  };
};

const constructGetDeleteRequest = (
  method,
  baseUrl,
  path,
  key,
  token,
  options,
  extraOption
) => {
  if (path.includes("webhook") && method === "DELETE")
    return {
      url: `${baseUrl}${path}`,
      method,
      data: { key, token },
    };

  const queryString = `?key=${key}&token=${token}`;

  if (!options) return { url: `${baseUrl}${path}${queryString}`, method };

  if (Array.isArray(options))
    return {
      url: `${baseUrl}${path}${queryString}&${extraOption}=${options.join(
        ","
      )}`,
    };

  const keys = Object.keys(options);
  const values = Object.values(options);
  const additionalQueries = keys
    .map((key, index) => `&${key}=${values[index]}`)
    .join("");
  return {
    url: `${baseUrl}${path}${queryString}${additionalQueries}`,
  };
};

const constructRequest = (path, method, key, token, options, extraOption) => {
  if (!["GET", "POST", "DELETE", "PUT"].includes(method))
    throw new Error(
      "Unsupported requestMethod. Pass one of these methods: POST, GET, PUT, DELETE."
    );

  //need to check this
  if (method === "PUT")
    return constructPutRequest(method, baseUrl, path, key, token, options);

  if (method === "POST")
    return constructPostRequest(method, baseUrl, path, key, token, options);

  if (method === "GET" || method === "DELETE")
    return constructGetDeleteRequest(
      method,
      baseUrl,
      path,
      key,
      token,
      options,
      extraOption
    );
};

const handleMultipleParams = (objToPopulate, paramsObject) => {
  const keys = Object.keys(paramsObject);
  const values = Object.values(paramsObject);
  keys.map((key, index) => (objToPopulate[key] = values[index]));
  return objToPopulate;
};

const handleMakeRequest = (key, token, url, requestMethod, options) => {
  const method = requestMethod.toUpperCase();

  if (options && typeof options !== "object")
    throw new TypeError("options should be an object");

  const requestData = constructRequest(url, method, key, token, options);
  //console.log(url, method, key, token, options);

  return makeRequest(requestData.url, requestData.method, requestData.data);
};

const makeRequest = (url, method, options) => {
  console.log(url, method, options);
  if (!method && !options) return fetch(url);

  if (!options) return fetch(url, { method });

  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });
};

const isNull = params => params.includes(undefined);

const checkParams = params => {
  if (isNull(params))
    throw new Error(
      "Unable to carry out the request, please check the parameters are valid"
    );
};

module.exports = {
  constructRequest,
  handleMultipleParams,
  makeRequest,
  checkParams,
  handleMakeRequest,
};
