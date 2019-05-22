require("es6-promise").polyfill();
require("cross-fetch/polyfill");

const constructRequest = (path, method, key, token, options, extraOption) => {
    if (!["GET", "POST", "DELETE", "PUT"].includes(method))
        throw new Error(
            "Unsupported requestMethod. Pass one of these methods: POST, GET, PUT, DELETE."
        );

    const baseUrl = "https://api.trello.com";

    if (method === ("GET" || "DELETE")) {
        const queryString = `?key=${key}&token=${token}`;

        //pure GET function
        if (!options) return { url: `${baseUrl}${path}${queryString}` };

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
    return {
        url: baseUrl + path,
        method,
        data: { ...options, key, token }
    };
};

const handleMultipleParams = (objToPopulate, paramsObject) => {
    const keys = Object.keys(paramsObject);
    const values = Object.values(paramsObject);
    keys.map((key, index) => (objToPopulate[key] = values[index]));
    return objToPopulate;
};

const handleMakeRequest = (key, token, url, requestMethod, options) => {
    const requestData = constructRequest(
        url,
        requestMethod,
        key,
        token,
        options
    );

    if (requestData.method && requestData.data)
        makeRequest(requestData.url, requestData.method, requestData.data);

    if (!requestData.method && !requestData.data) makeRequest(requestData.url);

    return;
};

const makeRequest = (url, requestMethod, options) => {
    if (!requestMethod && !options) return fetch(url);

    return fetch(url, {
        method: requestMethod,
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
