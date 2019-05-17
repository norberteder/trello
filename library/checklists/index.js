const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
  checkParams
} = require("../helpers");

const addItemToChecklist = (key, token, checkListId, name, position) => {
  checkParams([checkListId, name, position]);
  const request = constructRequest(
    `/1/checklists/${checkListId}/checkitems`,
    "POST",
    key,
    token,
    { name, pos: position }
  );

  return makeRequest(request.url, request.method, request.data);
};

const updateChecklist = (key, token, checklistId, extraParams) => {
  checkParams([checkListId, name, extraParams]);

  const params = handleMultipleParams({}, extraParams);
  const request = constructRequest(
    `/1/checklists/${checklistId}`,
    "PUT",
    key,
    token,
    params
  );

  return makeRequest(request.url, request.method, request.data);
};

module.exports = { addItemToChecklist, updateChecklist };
