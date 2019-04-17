const {
  constructRequest,
  handleMultipleParams,
  makeRequest,
} = require('../helpers');

const addWebhook = (description, callbackURL, idModel, key, token) => {
  const request = constructRequest(`/1/webhooks`, 'POST', key, token, {
    description,
    callbackURL,
    idModel,
  });
  return makeRequest(request.url, request.data, request.method);
};

const deleteWebhook = (webHookId, key, token) => {
  //get the webhook id https://api.trello.com/1/tokens/[token]/webhooks/?key=[key]
  const request = constructRequest(
    `/1/webhooks/${webHookId}`,
    'DELETE',
    key,
    token
  );
  return makeRequest(request.url, request.data, request.method);
};

module.exports = { addWebhook, deleteWebhook };
