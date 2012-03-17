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

Trello.prototype.addListToBoard = function (boardId, name, callback) {
    var query = this.createQuery();
    query.name = name;

    makeRequest(rest.post, this.uri + '/1/boards/' + boardId + '/lists', {query: query}, callback);
};

Trello.prototype.getListsOnBoard = function (boardId, callback) {
    makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/lists', {query: this.createQuery()}, callback);
};

Trello.prototype.getCardsOnBoard = function (boardId, callback) {
    makeRequest(rest.get, this.uri + '/1/boards/' + boardId + '/cards', {query: this.createQuery()}, callback);
};

Trello.prototype.deleteCard = function (cardId, callback) {
    makeRequest(rest.del, this.uri + '/1/cards/' + cardId, {query: this.createQuery()}, callback);
};

module.exports = Trello;