require("es6-promise").polyfill();
require("cross-fetch/polyfill");

const constructRequest = (path, method, key, token, options, extraOption) => {
    if (!["GET", "POST", "DELETE", "PUT"].includes(method))
        throw new Error(
            "Unsupported requestMethod. Pass one of these methods: POST, GET, PUT, DELETE."
        );

    const baseUrl = "https://api.trello.com";

    if (method === "GET") {
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
            data: { key, token },
            method
        };

    if (path.includes("webhook")) {
        return {
            url: `https://api.trello.com/1/tokens/${token}/webhooks/`,
            data: { key, ...options },
            method
        };
    }
    return {
        url: baseUrl + path,
        data: { ...options, key, token },
        method
    };
};

const handleMultipleParams = (objToPopulate, paramsObject) => {
    const keys = Object.keys(paramsObject);
    const values = Object.values(paramsObject);
    keys.map((key, index) => (objToPopulate[key] = values[index]));
    return objToPopulate;
};

const makeRequest = (url, options, requestMethod) => {
    if (requestMethod === "GET") return fetch(url);

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
    checkParams
};
