const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
} = require('../helpers');

const addItemToChecklist = (checkListId, name, position, key, token) => {
  const request = constructRequest(
    `/1/checklists/${checkListId}/checkitems`,
    'POST',
    key,
    token,
    { name, position: pos }
  );

  return makeRequest(request.url, request.data, request.method);
};

const updateChecklist = (checklistId, extraParams, key, token) => {
  const params = handleMultipleParams({}, extraParams);
  const request = constructRequest(
    `/1/checklists/${checklistId}`,
    'PUT',
    key,
    token,
    params
  );

  return makeRequest(request.url, request.data, request.method);
};

module.exports = { addItemToChecklist, updateChecklist };
