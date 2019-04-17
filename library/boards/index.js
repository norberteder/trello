const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
} = require('../helpers');

const addBoard = (name, description, teamId, key, token) => {
  if (!name || !description || !teamId)
    throw new Error(
      'Unable to create board because either a name, description or a team id was not supplied'
    );

  const request = constructRequest('/1/boards', 'POST', key, token, {
    name,
    desc: description,
    idOrganization: teamId,
  });

  return makeRequest(request.url, request.data, request.method);
};

const updateBoardPref = (boardId, extraParams, key, token) => {
  if (!boardId || !extraParams)
    throw new Error(
      'Unable to create board because either a boardId, fieldToChange or a value id was not supplied'
    );

  const params = handleMultipleParams({}, extraParams);
  const request = constructRequest(
    `/1/boards/${boardId}`,
    'PUT',
    key,
    token,
    params
  );

  return makeRequest(request.url, request.data, request.method);
};

const addListToBoard = (boardId, name, key, token) => {
  const request = constructRequest(
    `/1/boards/${boardId}/lists`,
    'POST',
    key,
    token,
    {
      name,
    }
  );

  return makeRequest(request.url, request.data, request.method);
};

const addMemberToBoard = (boardId, memberId, memberRights, key, token) => {
  if (!boardId || !memberId || !memberRights)
    throw new Error(
      'Unable to create board because either a boardId, memberId or memberRights were not supplied'
    );

  const request = constructRequest(
    `/1/boards/${boardId}/members/${memberId}`,
    'PUT',
    key,
    token,
    {
      type: memberRights,
    }
  );

  return makeRequest(request.url, request.data, request.method);
};

const getBoardMembers = (boardId, key, token) => {
  const request = constructRequest(
    `/1/boards/${boardId}/members`,
    'GET',
    key,
    token
  );
  return makeRequest(request.url);
};

const getListsOnBoard = (boardId, key, token) => {
  const request = constructRequest(
    `/1/boards/${boardId}/lists`,
    'GET',
    key,
    token
  );
  return makeRequest(request.url);
};

const getListsOnBoardByFilter = (boardId, filter, key, token) => {
  const request = constructRequest(
    `/1/boards/${boardId}/lists`,
    key,
    token,
    'GET',
    {
      filter,
    }
  );

  return makeRequest(request.url);
};

const getCardsOnBoard = (boardId, key, token) => {
  const request = constructRequest(
    `/1/boards/${boardId}/cards`,
    'GET',
    key,
    token
  );
  return makeRequest(request.url);
};

const getLabelsForBoard = (boardId, key, token) => {
  const request = constructRequest(
    `/1/boards/${boardId}/labels`,
    'GET',
    key,
    token
  );
  return makeRequest(request.url);
};

const addLabelOnBoard = (boardId, name, color, key, token) => {
  const request = constructRequest('/1/labels', 'POST', key, token, {
    idBoard: boardId,
    color,
    name,
  });
  return makeRequest(request.url, request.data, request.method);
};

const getCardsOnBoardWithExtraParams = (boardId, extraParam, key, token) => {
  const request = constructRequest(
    `/1/boards/${boardId}/cards/${extraParam}`,
    'GET',
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
  getCardsOnBoardWithExtraParams,
};
