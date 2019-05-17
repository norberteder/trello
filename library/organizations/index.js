const {
  constructRequest,
  handleMultipleParams,
  makeRequest
} = require("../helpers");

const getOrgBoards = (key, token, organizationId) => {
  const request = constructRequest(
    `/1/organizations/${organizationId}/boards`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

const getOrgMembers = (key, token, organizationId) => {
  const request = constructRequest(
    `/1/organizations/${organizationId}/members`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url);
};

module.exports = { getOrgBoards, getOrgMembers };
