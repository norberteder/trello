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
    fn(uri, options)
        .on('complete', function (result) {
            if (result instanceof Error) {
                callback(result);
            } else {
                callback(null, result);
            }
        });
}

Trello.prototype.addBoard = function (name, description, organizationId, callback) {
    var query = this.createQuery();
    query.name = name;

    if (description !== null)
        query.desc = description;
    if (organizationId !== null)
        query.idOrganization = organizationId;

    makeRequest(rest.post, this.uri + '/1/boards', {query: query}, callback);
};

Trello.prototype.addCard = function (name, description, listId, callback) {
    var query = this.createQuery();
    query.name = name;
    query.idList = listId;

    if (description !== null)
        query.desc = description;

    makeRequest(rest.post, this.uri + '/1/cards', {query: query}, callback);
};

Trello.prototype.getCard = function (boardId, cardId, callback) {
    makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/cards/' + cardId, {query: this.createQuery()}, callback);
};

Trello.prototype.getCardsForList = function(listId, actions, callback) {
    var query = this.createQuery();
    if (actions)
        query.actions = actions;
    makeRequest(rest.get, this.uri + '/1/lists/' + listId + '/cards', {query: query}, callback);
};

Trello.prototype.addListToBoard = function (boardId, name, callback) {
    var query = this.createQuery();
    query.name = name;

    makeRequest(rest.post, this.uri + '/1/boards/' + boardId + '/lists', {query: query}, callback);
};

Trello.prototype.addCommentToCard = function (cardId, comment, callback) {
    var query = this.createQuery();
    query.text = comment;

    makeRequest(rest.post, this.uri + '/1/cards/' + cardId + '/actions/comments', {query: query}, callback);
};

Trello.prototype.addMemberToCard = function (cardId, memberId, callback) {
    var query = this.createQuery();
    query.value = memberId;

    makeRequest(rest.post, this.uri + '/1/cards/' + cardId + '/members', {query: query}, callback);
};

Trello.prototype.getBoards = function(memberId, callback) {
    makeRequest(rest.get, this.uri + '/1/members/' + memberId + '/boards', {query: this.createQuery()}, callback);
};

Trello.prototype.addItemToChecklist = function (checkListId, name, callback) {
    var query = this.createQuery();
    query.name = name;

    makeRequest(rest.post, this.uri + '/1/checklists/' + checkListId + '/checkitems', {query: query}, callback);
}

Trello.prototype.updateCard = function (cardId, field, value, callback) {
    var query = this.createQuery();
    query.value = value;

    makeRequest(rest.put, this.uri + '/1/cards/' + cardId + '/' + field, {query: query}, callback);
}

Trello.prototype.updateCardName = function (cardId, name, callback) {
    this.updateCard(cardId, 'name', name, callback);
}

Trello.prototype.updateCardDescription = function (cardId, description, callback) {
    this.updateCard(cardId, 'desc', description, callback);
}

Trello.prototype.updateCardList = function (cardId, listId, callback) {
    this.updateCard(cardId, 'idList', listId, callback);
}

Trello.prototype.getBoardMembers = function (boardId, callback) {
    makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/members', {query: this.createQuery()}, callback);
};

Trello.prototype.getListsOnBoard = function (boardId, callback) {
    makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/lists', {query: this.createQuery()}, callback);
};

Trello.prototype.getListsOnBoardByFilter = function(boardId, filter, callback) {
    var query = this.createQuery();
    query.filter = filter;
    makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/lists', {query: query}, callback);
};

Trello.prototype.getCardsOnBoard = function (boardId, callback) {
    makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/cards', {query: this.createQuery()}, callback);
};

Trello.prototype.getCardsOnList = function (listId, callback) {
    makeRequest(rest.get, this.uri + '/1/lists/' + listId + '/cards', {query: this.createQuery()}, callback);
}

Trello.prototype.deleteCard = function (cardId, callback) {
    makeRequest(rest.del, this.uri + '/1/cards/' + cardId, {query: this.createQuery()}, callback);
};

Trello.prototype.addWebhook = function (description, callbackUrl, idModel, callback) {
    var query = this.createQuery();
    var data = {};

    data.description = description;
    data.callbackURL = callbackUrl;
    data.idModel = idModel;

    makeRequest(rest.post, this.uri + '/1/tokens/' + this.token + '/webhooks/', { data: data, query: query }, callback);
};

Trello.prototype.deleteWebhook = function (webHookId, callback) {
    var query = this.createQuery();
    
    makeRequest(rest.del, this.uri + '/1/webhooks/' + webHookId, { query: query }, callback);
};

module.exports = Trello;