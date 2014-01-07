var rest = require('rest-client');

var Trello = function (key, token) {
    this.uri = "https://api.trello.com";
    this.key = key;
    this.token = token;
};

Trello.prototype.createQuery = function () {
    return {key: this.key, token: this.token};
};

function makeRequest(method, uri, options, callback) {
    rest.send({
        url: uri,
        method: method,
        form: options
    }, function(res, body) {
        if (res.statusCode === 200) {
            callback(null, body);
        } else {
            callback(new Error(body));
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

    makeRequest('POST', this.uri + '/1/boards', query, callback);
};

Trello.prototype.addCard = function (name, description, listId, callback) {
    var query = this.createQuery();
    query.name = name;
    query.idList = listId;

    if (description !== null)
        query.desc = description;

    makeRequest('POST', this.uri + '/1/cards', query, callback);
};

Trello.prototype.getCard = function (boardId, cardId, callback) {
    makeRequest('GET', this.uri + '/1/boards/' + boardId + '/cards/' + cardId, this.createQuery(), callback);
};

Trello.prototype.getCardsForList = function(listId, actions, callback) {
    var query = this.createQuery();
    if (actions)
        query.actions = actions;
    makeRequest('GET', this.uri + '/1/lists/' + listId + '/cards', query, callback);
};

Trello.prototype.addListToBoard = function (boardId, name, callback) {
    var query = this.createQuery();
    query.name = name;

    makeRequest('POST', this.uri + '/1/boards/' + boardId + '/lists', query, callback);
};

Trello.prototype.addCommentToCard = function (cardId, comment, callback) {
    var query = this.createQuery();
    query.text = comment;

    makeRequest('POST', this.uri + '/1/cards/' + cardId + '/actions/comments', query, callback);
};

Trello.prototype.addMemberToCard = function (cardId, memberId, callback) {
    var query = this.createQuery();
    query.value = memberId;

    makeRequest('POST', this.uri + '/1/cards/' + cardId + '/members', query, callback);
};

Trello.prototype.getBoards = function(memberId, callback) {
    makeRequest('GET', this.uri + '/1/members/' + memberId + '/boards', this.createQuery(), callback);
};

Trello.prototype.getBoardMembers = function (boardId, callback) {
    makeRequest('GET', this.uri + '/1/boards/' + boardId + '/members', this.createQuery(), callback);
};

Trello.prototype.getListsOnBoard = function (boardId, callback) {
    makeRequest('GET', this.uri + '/1/boards/' + boardId + '/lists', this.createQuery(), callback);
};

Trello.prototype.getListsOnBoardByFilter = function(boardId, filter, callback) {
    var query = this.createQuery();
    query.filter = filter;
    makeRequest('GET', this.uri + '/1/boards/' + boardId + '/lists', query, callback);
};

Trello.prototype.getCardsOnBoard = function (boardId, callback) {
    makeRequest('GET', this.uri + '/1/boards/' + boardId + '/cards', this.createQuery(), callback);
};

Trello.prototype.deleteCard = function (cardId, callback) {
    makeRequest('DELETE', this.uri + '/1/cards/' + cardId, this.createQuery(), callback);
};

module.exports = Trello;