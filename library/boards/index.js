const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
  checkParams
} = require("../helpers");

const addBoard = (name, description, teamId, key, token) => {
  checkParams([name, description, teamId]);

  const request = constructRequest("/1/boards", "POST", key, token, {
    name,
    desc: description,
    idOrganization: teamId
  });

  return makeRequest(request.url, request.data, request.method);
};

const updateBoardPref = (boardId, extraParams, key, token) => {
  checkParams([boardId, extraParams]);

  const params = handleMultipleParams({}, extraParams);
  const request = constructRequest(
    `/1/boards/${boardId}`,
    "PUT",
    key,
    token,
    params
  );

  return makeRequest(request.url, request.data, request.method);
};

const addListToBoard = (boardId, name, key, token) => {
  checkParams([boardId, name]);

  const request = constructRequest(
    `/1/boards/${boardId}/lists`,
    "POST",
    key,
    token,
    {
      name
    }
  );

  return makeRequest(request.url, request.data, request.method);
};

const addMemberToBoard = (boardId, memberId, memberRights, key, token) => {
  checkParams([boardId, memberId, memberRights]);

  const request = constructRequest(
    `/1/boards/${boardId}/members/${memberId}`,
    "PUT",
    key,
    token,
    {
      type: memberRights
    }
  );

  return makeRequest(request.url, request.data, request.method);
};

const getBoardMembers = (boardId, key, token) => {
  checkParams([boardId]);

  const request = constructRequest(
    `/1/boards/${boardId}/members`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const getListsOnBoard = (boardId, key, token) => {
  checkParams([boardId]);

  const request = constructRequest(
    `/1/boards/${boardId}/lists`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const getListsOnBoardByFilter = (boardId, filter, key, token) => {
  checkParams([boardId, filter]);

  const request = constructRequest(
    `/1/boards/${boardId}/lists`,
    key,
    token,
    "GET",
    {
      filter
    }
  );

  return makeRequest(request.url);
};

const getCardsOnBoard = (boardId, key, token) => {
  checkParams([boardId]);

  const request = constructRequest(
    `/1/boards/${boardId}/cards`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const getLabelsForBoard = (boardId, key, token) => {
  checkParams([boardId]);

  const request = constructRequest(
    `/1/boards/${boardId}/labels`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const addLabelOnBoard = (boardId, name, color, key, token) => {
  checkParams([boardId, name, color]);

  const request = constructRequest("/1/labels", "POST", key, token, {
    idBoard: boardId,
    color,
    name
  });
  return makeRequest(request.url, request.data, request.method);
};

const getCardsOnBoardWithExtraParams = (boardId, extraParam, key, token) => {
  checkParams([boardId, extraParam]);

  const request = constructRequest(
    `/1/boards/${boardId}/cards/${extraParam}`,
    "GET",
    key,
    token
  );

  return makeRequest(request.url);
};

module.exports = {
  addBoard,
  updateBoardPref,
  addListToBoard,
  addMemberToBoard,
  getBoardMembers,
  getListsOnBoard,
  getListsOnBoardByFilter,
  getCardsOnBoard,
  getLabelsForBoard,
  addLabelOnBoard,
  getCardsOnBoardWithExtraParams
};
