const {
  constructRequest,
  handleMultipleParams,
  makeRequest
} = require("../helpers");

const renameList = (key, token, listId, name) => {
  const request = constructRequest(
    `/1/lists/${listId}/name`,
    "PUT",
    key,
    token,
    {
      value: name
    }
  );

  return makeRequest(request.url, request.data, request.method);
};

const getCardsForList = (key, token, listId) => {
  const request = constructRequest(`/1/lists/${listId}`, "GET", key, token);
  return makeRequest(request.url);
};

const getCardsOnList = (key, token, listId) => {
  const request = constructRequest(
    `/1/lists/${listId}/cards`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const getCardsOnListWithExtraParams = (key, token, listId, fields) => {
  // e.g. trello.getCardsOnList('5c8a3b4eb42f42133e1ea998', ['id', 'name', 'badges']);
  const request = constructRequest(
    `/1/lists/${listId}/cards`,
    "GET",
    key,
    token,
    fields,
    "fields"
  );

  return makeRequest(request.url);
};

module.exports = {
  renameList,
  getCardsForList,
  getCardsOnList,
  getCardsOnListWithExtraParams
};
