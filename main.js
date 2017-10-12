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
            callback(result);
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
              } else {
                  resolve(result);
              }
            }

            fn(uri, options).once('complete', completeCallback);
        });
    }
}

Trello.prototype.makeRequest = function (requestMethod, path, options, callback) {
    options = options || {};

    if (typeof requestMethod !== 'string') {
        throw new TypeError("requestMethod should be a string");
    }
    if (typeof options !== 'object') {
        throw new TypeError("options should be an object");
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
    var query = objectAssign({}, options, keyTokenObj);
    return makeRequest(methods[method], this.uri + path, {query: query}, callback)
};

Trello.prototype.addBoard = function (name, description, organizationId, callback) {
    var query = this.createQuery();
    query.name = name;

    if (description !== null)
        query.desc = description;
    if (organizationId !== null)
        query.idOrganization = organizationId;

    return makeRequest(rest.post, this.uri + '/1/boards', {query: query}, callback);
};

Trello.prototype.updateBoardPref = function (boardId, field, value, callback) {
    var query = this.createQuery();
    query.value = value;

    return makeRequest(rest.put, this.uri + '/1/boards/' + boardId + '/prefs/' + field, {query: query}, callback);
};

Trello.prototype.addCard = function (name, description, listId, callback) {
    var query = this.createQuery();
    query.name = name;
    query.idList = listId;

    if (description !== null)
        query.desc = description;

    return makeRequest(rest.post, this.uri + '/1/cards', {query: query}, callback);
};

Trello.prototype.addCardWithExtraParams = function(name, extraParams, listId, callback) {
    var query = this.createQuery();
    query.name = name;
    query.idList = listId;

    Object.assign(query, extraParams);

    return makeRequest(rest.post, this.uri + '/1/cards', {query: query}, callback);
};

Trello.prototype.getCard = function (boardId, cardId, callback) {
    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/cards/' + cardId, {query: this.createQuery()}, callback);
};

Trello.prototype.getCardsForList = function(listId, actions, callback) {
    var query = this.createQuery();
    if (actions)
        query.actions = actions;
    return makeRequest(rest.get, this.uri + '/1/lists/' + listId + '/cards', {query: query}, callback);
};

Trello.prototype.renameList = function (listId, name, callback) {
    var query = this.createQuery();
    query.value = name;

    return makeRequest(rest.put, this.uri + '/1/lists/' + listId + '/name', {query: query}, callback);
};

Trello.prototype.addListToBoard = function (boardId, name, callback) {
    var query = this.createQuery();
    query.name = name;

    return makeRequest(rest.post, this.uri + '/1/boards/' + boardId + '/lists', {query: query}, callback);
};

Trello.prototype.addMemberToBoard = function (boardId, memberId, type, callback) {
    var query = this.createQuery();
    var data = {type: type}; // Valid Values: 'normal','admin','observer'

    return makeRequest(rest.put, this.uri + '/1/boards/' + boardId + '/members/' + memberId, { data: data, query: query }, callback);
};

Trello.prototype.addCommentToCard = function (cardId, comment, callback) {
    var query = this.createQuery();
    query.text = comment;

    return makeRequest(rest.post, this.uri + '/1/cards/' + cardId + '/actions/comments', {query: query}, callback);
};

Trello.prototype.addAttachmentToCard = function (cardId, url, callback) {
    var query = this.createQuery();
    query.url = url;

    return makeRequest(rest.post, this.uri + '/1/cards/' + cardId + '/attachments', {query: query}, callback);
};

Trello.prototype.addMemberToCard = function (cardId, memberId, callback) {
    var query = this.createQuery();
    query.value = memberId;

    return makeRequest(rest.post, this.uri + '/1/cards/' + cardId + '/members', {query: query}, callback);
};

Trello.prototype.getBoards = function(memberId, callback) {
    return makeRequest(rest.get, this.uri + '/1/members/' + memberId + '/boards', {query: this.createQuery()}, callback);
};

Trello.prototype.getOrgBoards = function (organizationId, callback) {
    return makeRequest(rest.get, this.uri + '/1/organizations/' + organizationId + '/boards', {query: this.createQuery()}, callback);
};

Trello.prototype.addChecklistToCard = function (cardId, name, callback) {
    var query = this.createQuery();
    query.name = name;

    return makeRequest(rest.post, this.uri + '/1/cards/' + cardId + '/checklists', { query: query }, callback);
};

Trello.prototype.addExistingChecklistToCard = function (cardId, checklistId, callback) {
    var query = this.createQuery();
    query.idChecklistSource = checklistId;

    return makeRequest(rest.post, this.uri + '/1/cards/' + cardId + '/checklists', { query: query }, callback);
};

Trello.prototype.getChecklistsOnCard = function (cardId, callback) {
    return makeRequest(rest.get, this.uri + '/1/cards/' + cardId + '/checklists', {query: this.createQuery()}, callback);
};

Trello.prototype.addItemToChecklist = function (checkListId, name, pos, callback) {
    var query = this.createQuery();
    query.name = name;
    query.pos = pos;

    return makeRequest(rest.post, this.uri + '/1/checklists/' + checkListId + '/checkitems', {query: query}, callback);
};

Trello.prototype.updateCard = function (cardId, field, value, callback) {
    var query = this.createQuery();
    query.value = value;

    return makeRequest(rest.put, this.uri + '/1/cards/' + cardId + '/' + field, {query: query}, callback);
};

Trello.prototype.updateChecklist = function (checklistId, field, value, callback) {
    var query = this.createQuery();
    query.value = value;

    return makeRequest(rest.put, this.uri + '/1/checklists/' + checklistId + '/' + field, {query: query}, callback);
};

Trello.prototype.updateCardName = function (cardId, name, callback) {
    return this.updateCard(cardId, 'name', name, callback);
};

Trello.prototype.updateCardDescription = function (cardId, description, callback) {
    return this.updateCard(cardId, 'desc', description, callback);
};

Trello.prototype.updateCardList = function (cardId, listId, callback) {
    return this.updateCard(cardId, 'idList', listId, callback);
};

Trello.prototype.getMember = function(memberId, callback) {
    return makeRequest(rest.get, this.uri + '/1/member/' + memberId, {query: this.createQuery()}, callback);
};

Trello.prototype.getMemberCards = function (memberId, callback) {
    return makeRequest(rest.get, this.uri + '/1/members/' + memberId + '/cards', {query: this.createQuery()}, callback);
};

Trello.prototype.getBoardMembers = function (boardId, callback) {
    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/members', {query: this.createQuery()}, callback);
};

Trello.prototype.getOrgMembers = function (organizationId, callback) {
    return makeRequest(rest.get, this.uri + '/1/organizations/' + organizationId + '/members', {query: this.createQuery()}, callback);
};

Trello.prototype.getListsOnBoard = function (boardId, callback) {
    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/lists', {query: this.createQuery()}, callback);
};

Trello.prototype.getListsOnBoardByFilter = function(boardId, filter, callback) {
    var query = this.createQuery();
    query.filter = filter;
    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/lists', {query: query}, callback);
};

Trello.prototype.getCardsOnBoard = function (boardId, callback) {
    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/cards', {query: this.createQuery()}, callback);
};

Trello.prototype.getCardsOnBoardWithExtraParams = function (boardId, extraParams, callback) {
    var query = this.createQuery();    
    Object.assign(query, extraParams);

    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/cards', {query: query}, callback);
}

Trello.prototype.getCardsOnList = function (listId, callback) {
    return makeRequest(rest.get, this.uri + '/1/lists/' + listId + '/cards', {query: this.createQuery()}, callback);
};

Trello.prototype.getCardsOnListWithExtraParams = function (listId, extraParams, callback) {
    var query = this.createQuery();    
    Object.assign(query, extraParams);

    return makeRequest(rest.get, this.uri + '/1/lists/' + listId + '/cards', {query: query}, callback);
}

Trello.prototype.deleteCard = function (cardId, callback) {
    return makeRequest(rest.del, this.uri + '/1/cards/' + cardId, {query: this.createQuery()}, callback);
};

Trello.prototype.addWebhook = function (description, callbackUrl, idModel, callback) {
    var query = this.createQuery();
    var data = {};

    data.description = description;
    data.callbackURL = callbackUrl;
    data.idModel = idModel;

    return makeRequest(rest.post, this.uri + '/1/tokens/' + this.token + '/webhooks/', { data: data, query: query }, callback);
};

Trello.prototype.deleteWebhook = function (webHookId, callback) {
    var query = this.createQuery();

    return makeRequest(rest.del, this.uri + '/1/webhooks/' + webHookId, { query: query }, callback);
};

Trello.prototype.getLabelsForBoard = function(boardId, callback) {
    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/labels', {query:this.createQuery()}, callback);
};

Trello.prototype.addLabelOnBoard = function(boardId, name, color, callback) {
    var query = this.createQuery();
    var data = {
        idBoard: boardId,
        color: color,
        name: name
    };

    return makeRequest(rest.post, this.uri + '/1/labels', {data: data, query:query}, callback);
};

Trello.prototype.deleteLabel = function(labelId, callback) {
    return makeRequest(rest.del, this.uri + '/1/labels/' + labelId, {query: this.createQuery()}, callback);
};

Trello.prototype.addLabelToCard = function(cardId, labelId, callback) {
    var query = this.createQuery();
    var data = { value: labelId };
    return makeRequest(rest.post, this.uri+'/1/cards/' + cardId + '/idLabels', {query:query, data:data}, callback);
};

Trello.prototype.deleteLabelFromCard = function(cardId, labelId, callback){
    return makeRequest(rest.del, this.uri + '/1/cards/' + cardId + '/idLabels/'+labelId, {query: this.createQuery()}, callback);
};

Trello.prototype.updateLabel = function (labelId, field, value, callback) {
    var query = this.createQuery();
    query.value = value;

    return makeRequest(rest.put, this.uri + '/1/labels/' + labelId + '/' + field, {query: query}, callback);
};

Trello.prototype.updateLabelName = function (labelId, name, callback) {
    return this.updateLabel(labelId, 'name', name, callback);
};

Trello.prototype.updateLabelColor = function (labelId, color, callback) {
    return this.updateLabel(labelId, 'color', color, callback);
};

Trello.prototype.getCardStickers = function (cardId, callback) {
    return makeRequest(rest.get, this.uri + '/1/cards/' + cardId + '/stickers', {query: this.createQuery()}, callback);
};

Trello.prototype.addStickerToCard = function(cardId, image, left, top, zIndex, rotate, callback) {
    var query = this.createQuery();
    var data = {
      image: image,
      top: top,
      left: left,
      zIndex: zIndex,
      rotate: rotate,
    };
    return makeRequest(rest.post, this.uri+'/1/cards/' + cardId + '/stickers', {query:query, data:data}, callback);
};

Trello.prototype.addDueDateToCard = function (cardId, dateValue, callback) {
    var query = this.createQuery();
    query.value = dateValue;

    return makeRequest(rest.put, this.uri + '/1/cards/' + cardId + '/due', {query: query}, callback);
};


module.exports = Trello;
