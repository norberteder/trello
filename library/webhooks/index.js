const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
  checkParams,
} = require("../helpers");

const addWebhook = (key, token, description, callbackURL, idModel) => {
  checkParams([description, callbackURL, idModel]);

  const request = constructRequest(`/1/webhooks`, "POST", key, token, {
    description,
    callbackURL,
    idModel,
  });

  return makeRequest(request.url, request.method, request.data);
};

const deleteWebhook = (key, token, webHookId) => {
  //get the webhook id https://api.trello.com/1/tokens/[token]/webhooks/?key=[key]
  checkParams([webHookId]);

  const request = constructRequest(
    `/1/webhooks/${webHookId}`,
    "DELETE",
    key,
    token
  );
  return makeRequest(request.url, request.method);
};

module.exports = { addWebhook, deleteWebhook };
