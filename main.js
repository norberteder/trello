require('es6-promise').polyfill();
require('cross-fetch/polyfill');

var minRequestDelay = 500;
var maxRequestDelay = 7000;

var Trello = function(key, token) {
    this.key = key;
    this.token = token;
};

Trello.prototype.createQuery = function() {
    return { key: this.key, token: this.token };
};

Trello.prototype.constructRequest = function(path, method, options) {
    var query = this.createQuery();
    var baseUrl = 'https://api.trello.com';

    //for each option and the thingy to the end

    if (method === 'GET') {
        return {
            url: baseUrl + path + `?key=${query.key}&token=${query.token}&`,
        };
    }

    if (method === 'PUT' || 'POST' || 'DELETE')
        return { url: baseUrl + path, data: { ...options, ...query }, method };

    throw new Error(
        'Unsupported requestMethod. Pass one of these methods: POST, GET, PUT, DELETE.'
    );
};

Trello.prototype.handleMultipleParams = function(
    arrayToPopulate,
    paramsObject
) {
    var keys = Object.keys(paramsObject);
    var values = Object.values(paramsObject);
    keys.map((key, index) => (arrayToPopulate[key] = values[index]));
    return arrayToPopulate;
};

function makeRequest(url, options, requestMethod) {
    console.log(url, options, requestMethod);

    if (!options & !requestMethod) return fetch(url);

    return fetch(url, {
        method: requestMethod,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
    });
}

Trello.prototype.makeRequest = function(requestMethod, path, options) {
    if (requestMethod !== 'PUT' || 'POST' || 'DELETE')
        throw new Error(
            'Unsupported requestMethod. Pass one of these methods: POST, GET, PUT, DELETE.'
        );

    if (typeof options !== 'object')
        throw new TypeError('options should be an object');

    return makeRequest(path, options, requestMethod);
};

Trello.prototype.addBoard = function(name, description, teamId) {
    if (!name || !description || !teamId)
        throw new Error(
            'Unable to create board because either a name, description or a team id was not supplied'
        );

    var request = this.constructRequest('/1/boards', 'POST', {
        name,
        desc: description,
        idOrganization: teamId,
    });

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.updateBoardPref = function(boardId, extraParams) {
    if (!boardId || !extraParams)
        throw new Error(
            'Unable to create board because either a boardId, fieldToChange or a value id was not supplied'
        );

    const query = this.handleMultipleParams({}, extraParams);
    var request = this.constructRequest(`/1/boards/${boardId}`, 'PUT', query);

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addCard = function(name, listId) {
    if (!listId || !name || !description)
        throw new Error(
            'Unable to create board because either a listId, name or a description id was not supplied'
        );

    var request = this.constructRequest('/1/cards/', 'POST', { name });

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addCardWithExtraParams = function(name, extraParams, listId) {
    if (!listId || !name || !extraParams)
        throw new Error(
            'Unable to create board because either a listId, name or extra parameters were not supplied'
        );

    var query = this.handleMultipleParams(
        { name, idList: listId },
        extraParams
    );
    var request = this.constructRequest('/1/cards/', 'POST', query);

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.getCard = function(cardId) {
    var request = this.constructRequest(`/1/cards/${cardId}`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getCardsForList = function(listId) {
    var request = this.constructRequest(`/1/lists/${listId}`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.renameList = function(listId, name) {
    var request = this.constructRequest(`/1/lists/${listId}/name`, 'PUT', {
        value: name,
    });

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addListToBoard = function(boardId, name) {
    var request = this.constructRequest(`/1/boards/${boardId}/lists`, 'POST', {
        name,
    });

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addMemberToBoard = function(boardId, memberId, memberRights) {
    if (!boardId || !memberId || !memberRights)
        throw new Error(
            'Unable to create board because either a boardId, memberId or memberRights were not supplied'
        );

    var request = this.constructRequest(
        `/1/boards/${boardId}/members/${memberId}`,
        'PUT',
        {
            type: memberRights,
        }
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addCommentToCard = function(cardId, comment) {
    var request = this.constructRequest(
        `/1/cards/${cardId}/actions/comments`,
        'POST',
        {
            text: comments,
        }
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addAttachmentToCard = function(cardId, url) {
    var request = this.constructRequest(
        `/1/cards/${cardId}/attachments`,
        'POST',
        { url }
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addMemberToCard = function(cardId, memberId) {
    var request = this.constructRequest(`/1/cards/${cardId}/members`, 'POST', {
        value: memberId,
    });

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.getBoards = function(memberId) {
    var request = this.constructRequest(`/1/members/${memberId}/boards`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getOrgBoards = function(organizationId) {
    var request = this.constructRequest(
        `/1/organizations/${organizationId}/boards`,
        'GET'
    );
    return makeRequest(request.url);
};

Trello.prototype.addChecklistToCard = function(cardId, name) {
    var request = this.constructRequest(
        `/1/cards/${cardId}/checklists`,
        'POST',
        { name }
    );
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addExistingChecklistToCard = function(cardId, checklistId) {
    var request = this.constructRequest(
        `/1/cards/${cardId}/checklists`,
        'POST',
        { idChecklistSource: checklistId }
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.getChecklistsOnCard = function(cardId) {
    var request = this.constructRequest(`/1/cards/${cardId}/checklists`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.addItemToChecklist = function(checkListId, name, pos) {
    var request = this.constructRequest(
        `/1/checklists/${checkListId}/checkitems`,
        'POST',
        { name, pos }
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.updateCard = function(cardId, params) {
    const query = this.handleMultipleParams({}, params);
    var request = this.constructRequest(`/1/cards/${cardId}`, 'PUT', query);

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.updateChecklist = function(checklistId, params) {
    const query = this.handleMultipleParams({}, params);
    var request = this.constructRequest(
        `/1/checklists/${checklistId}`,
        'PUT',
        query
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.updateCardName = function(cardId, name) {
    return this.updateCard(cardId, { name });
};

Trello.prototype.updateCardDescription = function(cardId, description) {
    return this.updateCard(cardId, { desc: description });
};

Trello.prototype.updateCardList = function(cardId, listId) {
    return this.updateCard(cardId, { idList: listId });
};

Trello.prototype.getMember = function(memberId) {
    var request = this.constructRequest(`/1/member/${memberId}`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getMemberCards = function(memberId) {
    var request = this.constructRequest(`/1/member/${memberId}/cards`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getBoardMembers = function(boardId) {
    var request = this.constructRequest(`/1/boards/${boardId}/members`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getOrgMembers = function(organizationId) {
    var request = this.constructRequest(
        `/1/organizations/${organizationId}/members`,
        'GET'
    );
    return makeRequest(request.url);
};

Trello.prototype.getListsOnBoard = function(boardId) {
    var request = this.constructRequest(`/1/boards/${boardId}/lists`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getListsOnBoardByFilter = function(boardId, filter, callback) {
    var request = this.constructRequest(`/1/boards/${boardId}/lists`, 'GET');
    return makeRequest(request.url);

    var query = this.createQuery();
    query.filter = filter;
    return makeRequest(
        rest.get,
        this.uri + '/1/boards/' + boardId + '/lists',
        { query: query },
        callback
    );
};

Trello.prototype.getCardsOnBoard = function(boardId, callback) {
    return makeRequest(
        rest.get,
        this.uri + '/1/boards/' + boardId + '/cards',
        { query: this.createQuery() },
        callback
    );
};

Trello.prototype.getCardsOnBoardWithExtraParams = function(
    boardId,
    extraParams,
    callback
) {
    var query = this.createQuery();
    Object.assign(query, extraParams);

    return makeRequest(
        rest.get,
        this.uri + '/1/boards/' + boardId + '/cards',
        { query: query },
        callback
    );
};

Trello.prototype.getCardsOnList = function(listId, callback) {
    return makeRequest(
        rest.get,
        this.uri + '/1/lists/' + listId + '/cards',
        { query: this.createQuery() },
        callback
    );
};

Trello.prototype.getCardsOnListWithExtraParams = function(
    listId,
    extraParams,
    callback
) {
    var query = this.createQuery();
    Object.assign(query, extraParams);

    return makeRequest(
        rest.get,
        this.uri + '/1/lists/' + listId + '/cards',
        { query: query },
        callback
    );
};

Trello.prototype.deleteCard = function(cardId, callback) {
    return makeRequest(
        rest.del,
        this.uri + '/1/cards/' + cardId,
        { query: this.createQuery() },
        callback
    );
};

Trello.prototype.addWebhook = function(description, callbackURL, idModel) {
    var query = this.createQuery();
    const url = `https://api.trello.com/1/tokens/${query.token}/webhooks/?key=${
        query.key
    }`;

    return makeRequest(url, { description, callbackURL, idModel }, 'POST');
};

Trello.prototype.deleteWebhook = function(webHookId, callback) {
    var query = this.createQuery();

    return makeRequest(
        rest.del,
        this.uri + '/1/webhooks/' + webHookId,
        { query: query },
        callback
    );
};

Trello.prototype.getLabelsForBoard = function(boardId, callback) {
    return makeRequest(
        rest.get,
        this.uri + '/1/boards/' + boardId + '/labels',
        { query: this.createQuery() },
        callback
    );
};

Trello.prototype.addLabelOnBoard = function(boardId, name, color, callback) {
    var query = this.createQuery();
    var data = {
        idBoard: boardId,
        color: color,
        name: name,
    };

    return makeRequest(
        rest.post,
        this.uri + '/1/labels',
        { data: data, query: query },
        callback
    );
};

Trello.prototype.deleteLabel = function(labelId, callback) {
    return makeRequest(
        rest.del,
        this.uri + '/1/labels/' + labelId,
        { query: this.createQuery() },
        callback
    );
};

Trello.prototype.addLabelToCard = function(cardId, labelId, callback) {
    var query = this.createQuery();
    var data = { value: labelId };
    return makeRequest(
        rest.post,
        this.uri + '/1/cards/' + cardId + '/idLabels',
        { query: query, data: data },
        callback
    );
};

Trello.prototype.deleteLabelFromCard = function(cardId, labelId, callback) {
    return makeRequest(
        rest.del,
        this.uri + '/1/cards/' + cardId + '/idLabels/' + labelId,
        { query: this.createQuery() },
        callback
    );
};

Trello.prototype.updateLabel = function(labelId, field, value, callback) {
    var query = this.createQuery();
    query.value = value;

    return makeRequest(
        rest.put,
        this.uri + '/1/labels/' + labelId + '/' + field,
        { query: query },
        callback
    );
};

Trello.prototype.updateLabelName = function(labelId, name, callback) {
    return this.updateLabel(labelId, 'name', name, callback);
};

Trello.prototype.updateLabelColor = function(labelId, color, callback) {
    return this.updateLabel(labelId, 'color', color, callback);
};

Trello.prototype.getCardStickers = function(cardId, callback) {
    return makeRequest(
        rest.get,
        this.uri + '/1/cards/' + cardId + '/stickers',
        { query: this.createQuery() },
        callback
    );
};

Trello.prototype.addStickerToCard = function(
    cardId,
    image,
    left,
    top,
    zIndex,
    rotate,
    callback
) {
    var query = this.createQuery();
    var data = {
        image: image,
        top: top,
        left: left,
        zIndex: zIndex,
        rotate: rotate,
    };
    return makeRequest(
        rest.post,
        this.uri + '/1/cards/' + cardId + '/stickers',
        { query: query, data: data },
        callback
    );
};

Trello.prototype.addDueDateToCard = function(cardId, dateValue, callback) {
    var query = this.createQuery();
    query.value = dateValue;

    return makeRequest(
        rest.put,
        this.uri + '/1/cards/' + cardId + '/due',
        { query: query },
        callback
    );
};

module.exports = Trello;
