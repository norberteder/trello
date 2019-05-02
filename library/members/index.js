const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
} = require('../helpers');

const getBoards = (memberId, key, token) => {
  const request = constructRequest(
    `/1/members/${memberId}/boards`,
    'GET',
    key,
    token
  );
  return makeRequest(request.url);
};

const getMember = (memberId, key, token) => {
  const request = constructRequest(`/1/member/${memberId}`, 'GET', key, token);
  return makeRequest(request.url);
};

const getMemberCards = (memberId, key, token) => {
  const request = constructRequest(
    `/1/member/${memberId}/cards`,
    'GET',
    key,
    token
  );
  return makeRequest(request.url);
};

module.exports = { getBoards, getMember };
