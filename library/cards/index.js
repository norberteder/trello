const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
  checkParams
} = require("../helpers");

const addCard = (key, token, name, listId) => {
  checkParams([name, listId]);

  const request = constructRequest("/1/cards", "POST", key, token, {
    name,
    idList: listId
  });

  return makeRequest(request.url, request.method, request.data);
};

const addCardWithExtraParams = (key, token, name, extraParams, listId) => {
  if (!listId || !name || !extraParams)
    throw new Error(
      "Unable to create board because either a listId, name or extra parameters were not supplied"
    );

  const params = handleMultipleParams({ name, idList: listId }, extraParams);
  const request = constructRequest("/1/cards/", "POST", key, token, params);

  return makeRequest(request.url, request.method, request.data);
};

const getCard = (key, token, cardId) => {
  const request = constructRequest(`/1/cards/${cardId}`, "GET", key, token);
  return makeRequest(request.url);
};

const addCommentToCard = (key, token, cardId, comment) => {
  const request = constructRequest(
    `/1/cards/${cardId}/actions/comments`,
    "POST",
    key,
    token,
    {
      text: comments
    }
  );

  return makeRequest(request.url, request.method, request.data);
};

const addAttachmentToCard = (key, token, cardId, url) => {
  const request = constructRequest(
    `/1/cards/${cardId}/attachments`,
    "POST",
    key,
    token,
    { url }
  );

  return makeRequest(request.url, request.method, request.data);
};

const addMemberToCard = (key, token, cardId, memberId) => {
  const request = constructRequest(
    `/1/cards/${cardId}/members`,
    "POST",
    key,
    token,
    {
      value: memberId
    }
  );

  return makeRequest(request.url, request.method, request.data);
};

const addChecklistToCard = (key, token, cardId, name) => {
  const request = constructRequest(
    `/1/cards/${cardId}/checklists`,
    "POST",
    key,
    token,
    { name }
  );
  return makeRequest(request.url, request.method, request.data);
};

const addExistingChecklistToCard = (key, token, cardId, checklistId) => {
  const request = constructRequest(
    `/1/cards/${cardId}/checklists`,
    "POST",
    key,
    token,
    { idChecklistSource: checklistId }
  );

  return makeRequest(request.url, request.method, request.data);
};

const getChecklistsOnCard = (key, token, cardId) => {
  const request = constructRequest(
    `/1/cards/${cardId}/checklists`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const updateCard = (key, token, cardId, extraParams) => {
  const query = handleMultipleParams({}, params);
  const request = constructRequest(
    `/1/cards/${cardId}`,
    "PUT",
    key,
    token,
    query
  );

  return makeRequest(request.url, request.method, request.data);
};

const addLabelToCard = (key, token, cardId, labelId) => {
  const request = constructRequest(
    `/1/cards/${cardId}/idLabels`,
    "POST",
    key,
    token,
    {
      value: labelId
    }
  );
  return makeRequest(request.url, request.method, request.data);
};

const deleteLabelFromCard = (key, token, cardId, labelId) => {
  const request = this.constructRequest(
    `/1/cards/${cardId}/idLabels/${labelId}`,
    "DELETE",
    key,
    token
  );
  return makeRequest(request.url, request.data, request.method);
};

const getCardStickers = (key, token, cardId) => {
  const request = constructRequest(
    `/1/cards/${cardId}/stickers`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const addDueDateToCard = (key, token, cardId, dateValue) => {
  const request = constructRequest(
    `/1/cards/${cardId}/due`,
    "PUT",
    key,
    token,
    {
      value: dateValue
    }
  );
  return makeRequest(request.url, request.method, request.data);
};

const deleteCard = (key, token, cardId) => {
  const request = constructRequest(`/1/cards/${cardId}`, key, token, "DELETE");
  return makeRequest(request.url, request.method, request.data);
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
