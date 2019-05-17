const {
  constructRequest,
  handleMultipleParams,
  makeRequest
} = require("../helpers");

const getBoards = (key, token, memberId) => {
  const request = constructRequest(
    `/1/members/${memberId}/boards`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const getMember = (key, token, memberId) => {
  const request = constructRequest(`/1/member/${memberId}`, "GET", key, token);
  return makeRequest(request.url);
};

const getMemberCards = (key, token, memberId) => {
  const request = constructRequest(
    `/1/member/${memberId}/cards`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

module.exports = { getBoards, getMember };
