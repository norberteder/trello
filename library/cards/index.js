const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
  checkParams
} = require("../helpers");

const addCard = (name, extraParams, listId, key, token) => {
  checkParams([name, extraParams, listId]);

  const request = constructRequest("/1/cards", "POST", key, token, {
    name,
    idList: listId
  });

  return makeRequest(request.url, request.data, request.method);
};

const addCardWithExtraParams = (name, extraParams, listId, key, token) => {
  if (!listId || !name || !extraParams)
    throw new Error(
      "Unable to create board because either a listId, name or extra parameters were not supplied"
    );

  const params = handleMultipleParams({ name, idList: listId }, extraParams);
  const request = constructRequest("/1/cards/", "POST", key, token, params);

  return makeRequest(request.url, request.data, request.method);
};

const getCard = (cardId, key, token) => {
  const request = constructRequest(`/1/cards/${cardId}`, "GET", key, token);
  return makeRequest(request.url);
};

const addCommentToCard = (cardId, comment, key, token) => {
  const request = constructRequest(
    `/1/cards/${cardId}/actions/comments`,
    "POST",
    key,
    token,
    {
      text: comments
    }
  );

  return makeRequest(request.url, request.data, request.method);
};

const addAttachmentToCard = (cardId, url, key, token) => {
  const request = constructRequest(
    `/1/cards/${cardId}/attachments`,
    "POST",
    key,
    token,
    { url }
  );

  return makeRequest(request.url, request.data, request.method);
};

const addMemberToCard = (cardId, memberId, key, token) => {
  const request = constructRequest(
    `/1/cards/${cardId}/members`,
    "POST",
    key,
    token,
    {
      value: memberId
    }
  );

  return makeRequest(request.url, request.data, request.method);
};

const addChecklistToCard = (cardId, name, key, token) => {
  const request = constructRequest(
    `/1/cards/${cardId}/checklists`,
    "POST",
    key,
    token,
    { name }
  );
  return makeRequest(request.url, request.data, request.method);
};

const addExistingChecklistToCard = (cardId, checklistId, key, token) => {
  const request = constructRequest(
    `/1/cards/${cardId}/checklists`,
    "POST",
    key,
    token,
    { idChecklistSource: checklistId }
  );

  return makeRequest(request.url, request.data, request.method);
};

const getChecklistsOnCard = (cardId, key, token) => {
  const request = constructRequest(
    `/1/cards/${cardId}/checklists`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const updateCard = (cardId, extraParams, key, token) => {
  const query = handleMultipleParams({}, params);
  const request = constructRequest(
    `/1/cards/${cardId}`,
    "PUT",
    key,
    token,
    query
  );

  return makeRequest(request.url, request.data, request.method);
};

const addLabelToCard = (cardId, labelId, key, token) => {
  const request = constructRequest(
    `/1/cards/${cardId}/idLabels`,
    "POST",
    key,
    token,
    {
      value: labelId
    }
  );
  return makeRequest(request.url, request.data, request.method);
};

const deleteLabelFromCard = (cardId, labelId, key, token) => {
  const request = this.constructRequest(
    `/1/cards/${cardId}/idLabels/${labelId}`,
    "DELETE",
    key,
    token
  );
  return makeRequest(request.url, request.data, request.method);
};

const getCardStickers = (cardId, key, token) => {
  const request = constructRequest(
    `/1/cards/${cardId}/stickers`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const addDueDateToCard = (cardId, dateValue, key, token) => {
  const request = constructRequest(
    `/1/cards/${cardId}/due`,
    "PUT",
    key,
    token,
    {
      value: dateValue
    }
  );
  return makeRequest(request.url, request.data, request.method);
};

const deleteCard = (cardId, key, token) => {
  const request = constructRequest(`/1/cards/${cardId}`, key, token, "DELETE");
  return makeRequest(request.url, request.data, request.method);
};

module.exports = {
  addCard,
  addCardWithExtraParams,
  getCard,
  addCommentToCard,
  addAttachmentToCard,
  addMemberToCard,
  addChecklistToCard,
  addExistingChecklistToCard,
  getChecklistsOnCard,
  updateCard,
  addLabelToCard,
  deleteLabelFromCard,
  getCardStickers,
  addDueDateToCard,
  deleteCard
};
