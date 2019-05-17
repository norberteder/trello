const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
  checkParams
} = require("../helpers");

const renameList = (key, token, listId, name) => {
  checkParams([listId, name]);

  const request = constructRequest(
    `/1/lists/${listId}/name`,
    "PUT",
    key,
    token,
    {
      value: name
    }
  );
  return makeRequest(request.url, request.method, request.data);
};

const getCardsForList = (key, token, listId) => {
  checkParams([listId]);

  const request = constructRequest(`/1/lists/${listId}`, "GET", key, token);
  return makeRequest(request.url);
};

const getCardsOnList = (key, token, listId) => {
  checkParams([listId]);

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

  checkParams([listId, fields]);

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
