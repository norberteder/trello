require('es6-promise').polyfill();
var rest = require('restler');
var objectAssign = require('object-assign');

var minRequestDelay = 500;
var maxRequestDelay = 7000;

var Trello = function (key, token) {
    this.uri = "https://api.trello.com";
    this.key = key;
    this.token = token;
};

Trello.prototype.createQuery = function () {
    return {key: this.key, token: this.token};
};

function makeRequest(fn, uri, options, callback) {
    if (callback) {
      var completeCallback = function (result, response) {
        // in case we hit HTTP 429, delay requests by random timeout in between minRequestDelay and maxRequestDelay
        // http://help.trello.com/article/838-api-rate-limits
        if(response && response.statusCode === 429) {
          setTimeout(() => {
            fn(uri, options).once('complete', completeCallback)
          }, Math.floor(Math.random() * (maxRequestDelay - minRequestDelay)) + minRequestDelay);
        }
        else if (result instanceof Error) {
            callback(result, null);
        } else if (response != null && response.statusCode >= 400) {
            const rv = new Error(result)
            rv.response = response
            callback(rv, null)
        } else {
            callback(null, result);
        }
      }

      fn(uri, options).once('complete', completeCallback);

    } else {
        return new Promise((resolve, reject) => {

            var completeCallback = function (result, response) {
              // in case we hit HTTP 429, delay requests by random timeout in between minRequestDelay and maxRequestDelay
              // http://help.trello.com/article/838-api-rate-limits
              if(response && response.statusCode === 429) {
                setTimeout(() => {
                  fn(uri, options).once('complete', completeCallback)
                }, Math.floor(Math.random() * (maxRequestDelay - minRequestDelay)) + minRequestDelay);
              }
              else if (result instanceof Error) {
                  reject(result);
              } else if (response != null && response.statusCode >= 400) {
                  const rv = new Error(result)
                  rv.response = response
                  reject(rv)
              } else {
                  resolve(result);
              }
            }

            fn(uri, options).once('complete', completeCallback);
        });
    }
}

Trello.prototype.makeRequest = function (requestMethod, path, query, callback) {
    query = query || {};

    if (typeof requestMethod !== 'string') {
        throw new TypeError("requestMethod should be a string");
    }
    if (typeof query !== 'object') {
        throw new TypeError("query should be an object");
    }

    var method = requestMethod.toLowerCase();
    var methods = {
        'post': rest.post,
        'get': rest.get,
        'put': rest.put,
        'delete': rest.del
    };

    if (!methods[method]) {
        throw new Error("Unsupported requestMethod. Pass one of these methods: POST, GET, PUT, DELETE.");
    }
    var keyTokenObj = this.createQuery();
    query = objectAssign({}, query, keyTokenObj);
    return makeRequest(methods[method], this.uri + path, {query: query}, callback)
};

function extractExtraParams(extraParamsOrCallback) {
    if (typeof extraParamsOrCallback === 'object') {
        return extraParamsOrCallback
    } else if (typeof extraParamsOrCallback === 'function') {
        return {}
    } else if (typeof extraParamsOrCallback === 'undefined') {
        return {}
    } else {
        throw new Error("Invalid extra params or callback parameter of type " + typeof extraParamsOrCallback)
    }
}

function extractCallback(extraParamsOrCallback, callback) {
    if (typeof extraParamsOrCallback === 'function') {
        return extraParamsOrCallback
    } else if (typeof extraParamsOrCallback === 'object') {
        return callback
    } else if (typeof extraParamsOrCallback === 'undefined') {
        return callback
    } else {
        throw new Error("Invalid extra params or callback parameter of type " + typeof extraParamsOrCallback)
    }
}

function applyExtraParams(extraParamsOrCallback, query) {
    var extraParams = extractExtraParams(extraParamsOrCallback)
    return objectAssign({}, extraParams, query)
}

Trello.prototype.addBoard = function (name, description, organizationId, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.name = name;

    if (description !== null)
        query.desc = description;
    if (organizationId !== null)
        query.idOrganization = organizationId;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.post, this.uri + '/1/boards/', {query: query}, callback);
};

Trello.prototype.updateBoardPref = function (boardId, field, value, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.value = value;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.put, this.uri + '/1/boards/' + boardId + '/prefs/' + field, {query: query}, callback);
};

Trello.prototype.addCard = function (name, description, listId, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.name = name;
    query.idList = listId;

    if (description !== null)
        query.desc = description;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.post, this.uri + '/1/cards', {query: query}, callback);
};

Trello.prototype.addCardWithExtraParams = function(name, extraParams, listId, callback) {
    return this.addCard(name, null, listId, extraParams, callback)
};

Trello.prototype.getCard = function (boardId, cardId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/cards/' + cardId, {query: query}, callback);
};

Trello.prototype.getCardsForList = function(listId, actions, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    if (actions)
        query.actions = actions;
    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/lists/' + listId + '/cards', {query: query}, callback);
};

Trello.prototype.renameList = function (listId, name, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.value = name;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.put, this.uri + '/1/lists/' + listId + '/name', {query: query}, callback);
};

Trello.prototype.addListToBoard = function (boardId, name, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.name = name;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.post, this.uri + '/1/boards/' + boardId + '/lists', {query: query}, callback);
};

Trello.prototype.addMemberToBoard = function (boardId, memberId, type, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    var data = {type: type}; // Valid Values: 'normal','admin','observer'

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.put, this.uri + '/1/boards/' + boardId + '/members/' + memberId, { data: data, query: query }, callback);
};

Trello.prototype.addCommentToCard = function (cardId, comment, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.text = comment;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.post, this.uri + '/1/cards/' + cardId + '/actions/comments', {query: query}, callback);
};

Trello.prototype.addAttachmentToCard = function (cardId, url, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.url = url;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.post, this.uri + '/1/cards/' + cardId + '/attachments', {query: query}, callback);
};

Trello.prototype.addMemberToCard = function (cardId, memberId, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.value = memberId;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.post, this.uri + '/1/cards/' + cardId + '/members', {query: query}, callback);
};

Trello.prototype.getBoards = function(memberId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/members/' + memberId + '/boards', {query: query}, callback);
};

Trello.prototype.getOrgBoards = function (organizationId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/organizations/' + organizationId + '/boards', {query: query}, callback);
};

Trello.prototype.addChecklistToCard = function (cardId, name, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.name = name;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.post, this.uri + '/1/cards/' + cardId + '/checklists', { query: query }, callback);
};

Trello.prototype.addExistingChecklistToCard = function (cardId, checklistId, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.idChecklistSource = checklistId;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.post, this.uri + '/1/cards/' + cardId + '/checklists', { query: query }, callback);
};

Trello.prototype.getChecklistsOnCard = function (cardId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/cards/' + cardId + '/checklists', {query: query}, callback);
};

Trello.prototype.addItemToChecklist = function (checkListId, name, pos, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.name = name;
    query.pos = pos;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.post, this.uri + '/1/checklists/' + checkListId + '/checkitems', {query: query}, callback);
};

Trello.prototype.updateCard = function (cardId, field, value, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.value = value;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.put, this.uri + '/1/cards/' + cardId + '/' + field, {query: query}, callback);
};

Trello.prototype.updateChecklist = function (checklistId, field, value, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.value = value;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.put, this.uri + '/1/checklists/' + checklistId + '/' + field, {query: query}, callback);
};

Trello.prototype.updateCardName = function (cardId, name, extraParamsOrCallback, callback) {
    return this.updateCard(cardId, 'name', name, extraParamsOrCallback, callback);
};

Trello.prototype.updateCardDescription = function (cardId, description, extraParamsOrCallback, callback) {
    return this.updateCard(cardId, 'desc', description, extraParamsOrCallback, callback);
};

Trello.prototype.updateCardList = function (cardId, listId, extraParamsOrCallback, callback) {
    return this.updateCard(cardId, 'idList', listId, extraParamsOrCallback, callback);
};

Trello.prototype.getMember = function(memberId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/member/' + memberId, {query: query}, callback);
};

Trello.prototype.getMemberCards = function (memberId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/members/' + memberId + '/cards', {query: query}, callback);
};

Trello.prototype.getBoardMembers = function (boardId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/members', {query: query}, callback);
};

Trello.prototype.getOrgMembers = function (organizationId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/organizations/' + organizationId + '/members', {query: query}, callback);
};

Trello.prototype.getListsOnBoard = function (boardId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/lists', {query: query}, callback);
};

Trello.prototype.getListsOnBoardByFilter = function(boardId, filter, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.filter = filter;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/lists', {query: query}, callback);
};

Trello.prototype.getCardsOnBoard = function (boardId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/cards', {query: query}, callback);
};

Trello.prototype.getCardsOnBoardWithExtraParams = function (boardId, extraParams, callback) {
    return this.getCardsOnBoard(boardId, extraParams, callback)
}

Trello.prototype.getCardsOnList = function (listId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/lists/' + listId + '/cards', {query: query}, callback);
};

Trello.prototype.getCardsOnListWithExtraParams = function (listId, extraParams, callback) {
    return this.getCardsOnList(listId, extraParams, callback)
}

Trello.prototype.deleteCard = function (cardId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.del, this.uri + '/1/cards/' + cardId, {query: query}, callback);
};

Trello.prototype.addWebhook = function (description, callbackUrl, idModel, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    var data = {};

    data.description = description;
    data.callbackURL = callbackUrl;
    data.idModel = idModel;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.post, this.uri + '/1/tokens/' + this.token + '/webhooks/', { data: data, query: query }, callback);
};

Trello.prototype.deleteWebhook = function (webHookId, extraParamsOrCallback, callback) {
    var query = this.createQuery();

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.del, this.uri + '/1/webhooks/' + webHookId, { query: query }, callback);
};

Trello.prototype.getLabelsForBoard = function(boardId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/labels', {query:this.createQuery()}, callback);
};

Trello.prototype.addLabelOnBoard = function(boardId, name, color, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    var data = {
        idBoard: boardId,
        color: color,
        name: name
    };

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.post, this.uri + '/1/labels', {data: data, query:query}, callback);
};

Trello.prototype.deleteLabel = function(labelId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.del, this.uri + '/1/labels/' + labelId, {query: query}, callback);
};

Trello.prototype.addLabelToCard = function(cardId, labelId, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    var data = { value: labelId };
    
    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.post, this.uri+'/1/cards/' + cardId + '/idLabels', {query:query, data:data}, callback);
};

Trello.prototype.deleteLabelFromCard = function(cardId, labelId, extraParamsOrCallback, callback){
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.del, this.uri + '/1/cards/' + cardId + '/idLabels/'+labelId, {query: query}, callback);
};

Trello.prototype.updateLabel = function (labelId, field, value, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.value = value;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.put, this.uri + '/1/labels/' + labelId + '/' + field, {query: query}, callback);
};

Trello.prototype.updateLabelName = function (labelId, name, extraParamsOrCallback, callback) {
    return this.updateLabel(labelId, 'name', name, extraParamsOrCallback, callback);
};

Trello.prototype.updateLabelColor = function (labelId, color, extraParamsOrCallback, callback) {
    return this.updateLabel(labelId, 'color', color, extraParamsOrCallback, callback);
};

Trello.prototype.getCardStickers = function (cardId, extraParamsOrCallback, callback) {
    var query = applyExtraParams(extraParamsOrCallback, this.createQuery())
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.get, this.uri + '/1/cards/' + cardId + '/stickers', {query: query}, callback);
};

Trello.prototype.addStickerToCard = function(cardId, image, left, top, zIndex, rotate, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    var data = {
      image: image,
      top: top,
      left: left,
      zIndex: zIndex,
      rotate: rotate,
    };
    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.post, this.uri+'/1/cards/' + cardId + '/stickers', {query:query, data:data}, callback);
};

Trello.prototype.addDueDateToCard = function (cardId, dateValue, extraParamsOrCallback, callback) {
    var query = this.createQuery();
    query.value = dateValue;

    query = applyExtraParams(extraParamsOrCallback, query)
    callback = extractCallback(extraParamsOrCallback, callback)
    return makeRequest(rest.put, this.uri + '/1/cards/' + cardId + '/due', {query: query}, callback);
};


module.exports = Trello;
