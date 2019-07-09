const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
  checkParams,
} = require("../helpers");

const getOrgBoards = (key, token, organizationId) => {
  checkParams([organizationId]);

  const request = constructRequest(
    `/1/organizations/${organizationId}/boards`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url, request.method);
};

const getOrgMembers = (key, token, organizationId) => {
  checkParams([organizationId]);

  const request = constructRequest(
    `/1/organizations/${organizationId}/members`,
    "GET",
    key,
    token
  );
  return makeRequest(request.url, request.method);
};

module.exports = { getOrgBoards, getOrgMembers };
