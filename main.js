require('es6-promise').polyfill();
var rest = require('restler');

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
        fn(uri, options)
            .once('complete', function (result) {
                if (result instanceof Error) {
                    callback(result);
                } else {
                    callback(null, result);
                }
            });
    } else {
        return new Promise(function(resolve, reject) {
            fn(uri, options)
                .once('complete', function (result) {
                    if (result instanceof Error) {
                        reject(result);
                    } else {
                        resolve(result);
                    }
                });
        });
    }
}

Trello.prototype.addBoard = function (name, description, organizationId, callback) {
    var query = this.createQuery();
    query.name = name;

    if (description !== null)
        query.desc = description;
    if (organizationId !== null)
        query.idOrganization = organizationId;

    return makeRequest(rest.post, this.uri + '/1/boards', {query: query}, callback);
};

Trello.prototype.addCard = function (name, description, listId, callback) {
    var query = this.createQuery();
    query.name = name;
    query.idList = listId;

    if (description !== null)
        query.desc = description;

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
    query.name = name;

    return makeRequest(rest.put, this.uri + '/1/lists/' + listId + '/name', {query: query}, callback);
}

Trello.prototype.addListToBoard = function (boardId, name, callback) {
    var query = this.createQuery();
    query.name = name;

    return makeRequest(rest.post, this.uri + '/1/boards/' + boardId + '/lists', {query: query}, callback);
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

Trello.prototype.addChecklistToCard = function (cardId, name, callback) {
    var query = this.createQuery();
    query.name = name
    
    return makeRequest(rest.post, this.uri + '/1/cards/' + cardId + '/checklists', { query: query }, callback);
}

Trello.prototype.addItemToChecklist = function (checkListId, name, callback) {
    var query = this.createQuery();
    query.name = name;

    return makeRequest(rest.post, this.uri + '/1/checklists/' + checkListId + '/checkitems', {query: query}, callback);
};

Trello.prototype.updateCard = function (cardId, field, value, callback) {
    var query = this.createQuery();
    query.value = value;

    return makeRequest(rest.put, this.uri + '/1/cards/' + cardId + '/' + field, {query: query}, callback);
};

Trello.prototype.updateCardName = function (cardId, name, callback) {
    this.updateCard(cardId, 'name', name, callback);
};

Trello.prototype.updateCardDescription = function (cardId, description, callback) {
    this.updateCard(cardId, 'desc', description, callback);
};

Trello.prototype.updateCardList = function (cardId, listId, callback) {
    this.updateCard(cardId, 'idList', listId, callback);
};

Trello.prototype.getBoardMembers = function (boardId, callback) {
    return makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/members', {query: this.createQuery()}, callback);
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

Trello.prototype.getCardsOnList = function (listId, callback) {
    return makeRequest(rest.get, this.uri + '/1/lists/' + listId + '/cards', {query: this.createQuery()}, callback);
};

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
    makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/labels', {query:this.createQuery()}, callback);
};

Trello.prototype.addLabelOnBoard = function(boardId, name, color, callback) {
    var query = this.createQuery();
    var data = {
        idBoard: boardId,
        color: color,
        name: name
    };

    makeRequest(rest.post, this.uri + '/1/labels', {data: data, query:query}, callback);
};

Trello.prototype.deleteLabel = function(labelId, callback) {
    makeRequest(rest.del, this.uri + '/1/labels/' + labelId, {query: this.createQuery()}, callback);
};

Trello.prototype.addLabelToCard = function(cardId, labelId, callback) {
    var query = this.createQuery();
    var data = { value: labelId };
    makeRequest(rest.post, this.uri+'/1/cards/' + cardId + '/idLabels', {query:query, data:data}, callback);
};

Trello.prototype.deleteLabelFromCard = function(cardId, labelId, callback){
    makeRequest(rest.del, this.uri + '/1/cards/' + cardId + '/idLabels/'+labelId, {query: this.createQuery()}, callback);
};

Trello.prototype.updateLabel = function (labelId, field, value, callback) {
    var query = this.createQuery();
    query.value = value;

    makeRequest(rest.put, this.uri + '/1/labels/' + labelId + '/' + field, {query: query}, callback);
}

Trello.prototype.updateLabelName = function (labelId, name, callback) {
    this.updateLabel(labelId, 'name', name, callback);
}

Trello.prototype.updateLabelColor = function (labelId, color, callback) {
    this.upadateLabel(labelId, 'color', color, callback);
}


module.exports = Trello;
