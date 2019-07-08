require("es6-promise").polyfill();
require("cross-fetch/polyfill");

const baseUrl = "https://api.trello.com";

const constructPutRequest = (method, baseUrl, path, key, token, options) => {
    if (method === "PUT" && !options)
        return { url: `${baseUrl}${path}`, method };

    return {
        url: baseUrl + path,
        method,
        data: { ...options, key, token }
    };
};

const constructPostRequest = () => {};

const constructGetRequest = () => {};

const constructDeleteRequest = () => {};

const constructRequest = (path, method, key, token, options, extraOption) => {
    if (!["GET", "POST", "DELETE", "PUT"].includes(method))
        throw new Error(
            "Unsupported requestMethod. Pass one of these methods: POST, GET, PUT, DELETE."
        );

    if (method === "PUT" && !options)
        return { url: `${baseUrl}${path}`, method };

    if (method === "POST")
        return {
            url: baseUrl + path,
            method,
            data: { ...options, key, token }
        };

    if (method === "GET" || method === "DELETE" || method === "PUT") {
        const queryString = `?key=${key}&token=${token}`;

        if (!options) return { url: `${baseUrl}${path}${queryString}`, method };

        //pure GET function
        // if (!options) return { url: `${baseUrl}${path}${queryString}` };

        if (Array.isArray(options))
            return {
                url: `${baseUrl}${path}${queryString}&${extraOption}=${options.join(
                    ","
                )}`
            };

        const keys = Object.keys(options);
        const values = Object.values(options);
        const additionalQueries = keys
            .map((key, index) => `&${key}=${values[index]}`)
            .join("");
        return {
            url: `${baseUrl}${path}${queryString}${additionalQueries}`
        };
    }

    if (path.includes("webhook") && method === "DELETE")
        return {
            url: `${baseUrl}${path}`,
            method,
            data: { key, token }
        };

    if (path.includes("webhook")) {
        return {
            url: `https://api.trello.com/1/tokens/${token}/webhooks/`,
            method,
            data: { key, ...options }
        };
    }
};

const handleMultipleParams = (objToPopulate, paramsObject) => {
    const keys = Object.keys(paramsObject);
    const values = Object.values(paramsObject);
    keys.map((key, index) => (objToPopulate[key] = values[index]));
    return objToPopulate;
};

const handleMakeRequest = (key, token, url, requestMethod, options) => {
    const method = requestMethod.toUpperCase();

    if (!["GET", "POST", "DELETE", "PUT"].includes(method))
        throw new Error(
            "Unsupported requestMethod. Pass one of these methods: POST, GET, PUT, DELETE."
        );

    if (options && typeof options !== "object")
        throw new TypeError("options should be an object");

    const requestData = constructRequest(url, method, key, token, options);

    if (requestData.method && requestData.data)
        return makeRequest(
            requestData.url,
            requestData.method,
            requestData.data
        );

    if (!requestData.method && !requestData.data)
        return makeRequest(requestData.url);
    //new return
    //throw new Error("unable to make request");
};

const makeRequest = (url, method, options) => {
    if (!method && !options) return fetch(url);

    if (!options) return fetch(url, { method });

    return fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
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
    handleMakeRequest
};
