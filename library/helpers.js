require('es6-promise').polyfill();
require('cross-fetch/polyfill');

const constructRequest = (path, method, options, extraOption, key, token) => {
    if (!['GET', 'POST', 'DELETE', 'PUT'].includes(method))
        throw new Error(
            'Unsupported requestMethod. Pass one of these methods: POST, GET, PUT, DELETE.'
        );

    const query = { key, token };
    const baseUrl = 'https://api.trello.com';

    if (method === 'GET') {
        const queryString = `?key=${query.key}&token=${query.token}`;

        //pure GET function
        if (!options) return { url: `${baseUrl}${path}${queryString}` };

        if (Array.isArray(options))
            return {
                url: `${baseUrl}${path}${queryString}&${extraOption}=${options.join(
                    ','
                )}`,
            };

        const keys = Object.keys(options);
        const values = Object.values(options);
        const additionalQueries = keys
            .map((key, index) => `&${key}=${values[index]}`)
            .join('');

        return {
            url: `${baseUrl}${path}${queryString}${additionalQueries}`,
        };
    }

    if (path.includes('webhook') && method === 'DELETE')
        return {
            url: `${baseUrl}${path}`,
            data: { ...query },
            method,
        };

    if (path.includes('webhook')) {
        return {
            url: `https://api.trello.com/1/tokens/${query.token}/webhooks/`,
            data: { key: query.key, ...options },
            method,
        };
    }

    return {
        url: baseUrl + path,
        data: { ...options, ...query },
        method,
    };
};

const handleMultipleParams = (objToPopulate, paramsObject) => {
    const keys = Object.keys(paramsObject);
    const values = Object.values(paramsObject);
    keys.map((key, index) => (objToPopulate[key] = values[index]));
    return objToPopulate;
};

const makeRequest = (url, options, requestMethod) => {
    if (requestMethod === 'GET') return fetch(url);

    return fetch(url, {
        method: requestMethod,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
    });
};

module.exports = { constructRequest, handleMultipleParams, makeRequest };
