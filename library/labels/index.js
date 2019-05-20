const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
  checkParams
} = require("../helpers");

const updateLabel = (key, token, labelId, extraParams) => {
  checkParams([labelId, extraParams]);

  const params = handleMultipleParams({}, extraParams);
  const request = constructRequest(
    `/1/labels/${labelId}`,
    "PUT",
    key,
    token,
    params
  );
  return makeRequest(request.url, request.method, request.data);
};

const deleteLabel = (key, token, labelId) => {
  checkParams([labelId]);

  const request = constructRequest(
    `/1/labels/${labelId}`,
    "DELETE",
    key,
    token
  );
  return makeRequest(request.url, request.method, request.data);
};

module.exports = {
  updateLabel,
  deleteLabel
};
