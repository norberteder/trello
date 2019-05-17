const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
  checkParams
} = require("../helpers");

const addBoard = (key, token, name, description, teamId) => {
  checkParams([name, description, teamId]);

  const request = constructRequest("/1/boards", "POST", key, token, {
    name,
    desc: description,
    idOrganization: teamId
  });
  return makeRequest(request.method, request.url, request.data);
};

const updateBoardPref = (key, token, boardId, extraParams) => {
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

const addListToBoard = (key, token, boardId, name) => {
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

const addMemberToBoard = (key, token, boardId, memberId, memberRights) => {
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

const getBoardMembers = (key, token, boardId) => {
  checkParams([boardId]);

  const request = constructRequest(
    `/1/boards/${boardId}/members`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const getListsOnBoard = (key, token, boardId) => {
  checkParams([boardId]);

  const request = constructRequest(
    `/1/boards/${boardId}/lists`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const getListsOnBoardByFilter = (key, token, boardId, filter) => {
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

const getCardsOnBoard = (key, token, boardId) => {
  checkParams([boardId]);

  const request = constructRequest(
    `/1/boards/${boardId}/cards`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const getLabelsForBoard = (key, token, boardId) => {
  checkParams([boardId]);

  const request = constructRequest(
    `/1/boards/${boardId}/labels`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const addLabelOnBoard = (key, token, boardId, name, color) => {
  checkParams([boardId, name, color]);

  const request = constructRequest("/1/labels", "POST", key, token, {
    idBoard: boardId,
    color,
    name
  });
  return makeRequest(request.url, request.data, request.method);
};

const getCardsOnBoardWithExtraParams = (key, token, boardId, extraParam) => {
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
