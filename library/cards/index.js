const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
  checkParams,
} = require("../helpers");

const addCard = (key, token, name, listId) => {
  checkParams([name, listId]);

  const request = constructRequest("/1/cards", "POST", key, token, {
    name,
    idList: listId,
  });

  return makeRequest(request.url, request.method, request.data);
};

const addCardWithExtraParams = (key, token, name, extraParams, listId) => {
  checkParams([name, listId, extraParams]);

  const params = handleMultipleParams({ name, idList: listId }, extraParams);
  const request = constructRequest("/1/cards/", "POST", key, token, params);

  return makeRequest(request.url, request.method, request.data);
};

const getCard = (key, token, cardId) => {
  checkParams([cardId]);

  const request = constructRequest(`/1/cards/${cardId}`, "GET", key, token);
  return makeRequest(request.url, request.method);
};

const addCommentToCard = (key, token, cardId, comment) => {
  checkParams([cardId, comment]);

  const request = constructRequest(
    `/1/cards/${cardId}/actions/comments`,
    "POST",
    key,
    token,
    {
      text: comment,
    }
  );

  return makeRequest(request.url, request.method, request.data);
};

const addAttachmentToCard = (key, token, cardId, url) => {
  checkParams([cardId, url]);

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
  checkParams([cardId, memberId]);

  const request = constructRequest(
    `/1/cards/${cardId}/members`,
    "POST",
    key,
    token,
    {
      value: memberId,
    }
  );

  return makeRequest(request.url, request.method, request.data);
};

const addChecklistToCard = (key, token, cardId, name) => {
  checkParams([cardId, name]);

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
  checkParams([cardId, checklistId]);

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
  checkParams([cardId]);

  const request = constructRequest(
    `/1/cards/${cardId}/checklists`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url, request.method);
};

const updateCard = (key, token, cardId, extraParams) => {
  checkParams([cardId, extraParams]);

  const query = handleMultipleParams({}, extraParams);

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
  checkParams([cardId, labelId]);

  const request = constructRequest(
    `/1/cards/${cardId}/idLabels`,
    "POST",
    key,
    token,
    {
      value: labelId,
    }
  );

  //console.log("request: ", request.url, request.method, request.data);
  return makeRequest(request.url, request.method, request.data);
};

const deleteLabelFromCard = (key, token, cardId, labelId) => {
  checkParams([cardId, labelId]);

  const request = constructRequest(
    `/1/cards/${cardId}/idLabels/${labelId}`,
    "DELETE",
    key,
    token
  );

  return makeRequest(request.url, request.method);
};

const getCardStickers = (key, token, cardId) => {
  checkParams([cardId]);

  const request = constructRequest(
    `/1/cards/${cardId}/stickers`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url, request.method);
};

const addDueDateToCard = (key, token, cardId, date) => {
  //date e.g.: "2019-05-24T10:05:12.074Z"
  checkParams([cardId, date]);

  const request = constructRequest(
    `/1/cards/${cardId}?due=${date}&key=${key}&token=${token}`,
    "PUT",
    key,
    token
  );
  return makeRequest(request.url, request.method);
};

const deleteCard = (key, token, cardId) => {
  checkParams([cardId]);

  const request = constructRequest(`/1/cards/${cardId}`, "DELETE", key, token);
  return makeRequest(request.url, request.method);
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
  deleteCard,
};
