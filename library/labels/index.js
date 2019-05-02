const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
} = require('../helpers');

const updateLabel = (labelId, extraParams, key, token) => {
  const params = handleMultipleParams({}, extraParams);

  const request = constructRequest(
    `/1/labels/${labelId}`,
    'PUT',
    key,
    token,
    params
  );
  return makeRequest(request.url, request.data, request.method);
};

const deleteLabel = (labelId, key, token) => {
  const request = constructRequest(
    `/1/labels/${labelId}`,
    'DELETE',
    key,
    token
  );
  return makeRequest(request.url, request.data, request.method);
};

module.exports = {
  updateLabel,
};
