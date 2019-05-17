const {
  constructRequest,
  handleMultipleParams,
  makeRequest
} = require("../helpers");

const addItemToChecklist = (key, token, checkListId, name, position) => {
  const request = constructRequest(
    `/1/checklists/${checkListId}/checkitems`,
    "POST",
    key,
    token,
    { name, position: pos }
  );

  return makeRequest(request.url, request.data, request.method);
};

const updateChecklist = (key, token, checklistId, extraParams) => {
  const params = handleMultipleParams({}, extraParams);
  const request = constructRequest(
    `/1/checklists/${checklistId}`,
    "PUT",
    key,
    token,
    params
  );

  return makeRequest(request.url, request.data, request.method);
};

module.exports = { addItemToChecklist, updateChecklist };
