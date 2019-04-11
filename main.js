require('es6-promise').polyfill();
require('cross-fetch/polyfill');

var Trello = function(key, token) {
    this.key = key;
    this.token = token;
};

Trello.prototype.createQuery = function() {
    return { key: this.key, token: this.token };
};

Trello.prototype.constructRequest = function(
    path,
    method,
    options,
    extraOption
) {
    if (!['GET', 'POST', 'DELETE', 'PUT'].includes(method))
        throw new Error(
            'Unsupported requestMethod. Pass one of these methods: POST, GET, PUT, DELETE.'
        );

    var query = this.createQuery();
    var baseUrl = 'https://api.trello.com';

    if (method === 'GET') {
        var queryString = `?key=${query.key}&token=${query.token}`;

        //pure GET function
        if (!options) return { url: `${baseUrl}${path}${queryString}` };

        if (Array.isArray(options))
            return {
                url: `${baseUrl}${path}${queryString}&${extraOption}=${options.join(
                    ','
                )}`,
            };

        var keys = Object.keys(options);
        var values = Object.values(options);
        var additionalQueries = keys
            .map((key, index) => `&${key}=${values[index]}`)
            .join('');

        return {
            url: `${baseUrl}${path}${queryString}${additionalQueries}`,
        };
    }

    if (path.includes('webhook') && method === 'DELETE')
        return {
            url: `${baseUrl}${path}`,
            data: { ...query },
            method,
        };

    if (path.includes('webhook')) {
        return {
            url: `https://api.trello.com/1/tokens/${query.token}/webhooks/`,
            data: { key: query.key, ...options },
            method,
        };
    }

    return {
        url: baseUrl + path,
        data: { ...options, ...query },
        method,
    };
};

Trello.prototype.handleMultipleParams = function(objToPopulate, paramsObject) {
    var keys = Object.keys(paramsObject);
    var values = Object.values(paramsObject);
    keys.map((key, index) => (objToPopulate[key] = values[index]));
    return objToPopulate;
};

function makeRequest(url, options, requestMethod) {
    if (requestMethod === 'GET') return fetch(url);

    return fetch(url, {
        method: requestMethod,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
    });
}

Trello.prototype.makeRequest = function(requestMethod, path, options) {
    if (!['GET', 'POST', 'DELETE', 'PUT'].includes(method))
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

Trello.prototype.getListsOnBoardByFilter = function(boardId, filter) {
    var request = this.constructRequest(`/1/boards/${boardId}/lists`, 'GET', {
        filter,
    });

    return makeRequest(request.url);
};

Trello.prototype.getCardsOnBoard = function(boardId) {
    var request = this.constructRequest(`/1/boards/${boardId}/cards`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getCardsOnBoardWithExtraParams = function(
    boardId,
    extraParam
) {
    var request = this.constructRequest(
        `/1/boards/${boardId}/cards/${extraParam}`,
        'GET'
    );

    return makeRequest(request.url);
};

Trello.prototype.getCardsOnList = function(listId) {
    var request = this.constructRequest(`/1/lists/${listId}/cards`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getCardsOnListWithExtraParams = function(listId, fields) {
    // e.g. trello.getCardsOnList('5c8a3b4eb42f42133e1ea998', ['id', 'name', 'badges']);
    var request = this.constructRequest(
        `/1/lists/${listId}/cards`,
        'GET',
        fields,
        'fields'
    );

    return makeRequest(request.url);
};

Trello.prototype.deleteCard = function(cardId) {
    var request = this.constructRequest(`/1/cards/${cardId}`, 'DELETE');
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addWebhook = function(description, callbackURL, idModel) {
    var request = this.constructRequest(`/1/webhooks`, 'POST', {
        description,
        callbackURL,
        idModel,
    });
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.deleteWebhook = function(webHookId) {
    //get the webhook id https://api.trello.com/1/tokens/[token]/webhooks/?key=[key]
    var request = this.constructRequest(`/1/webhooks/${webHookId}`, 'DELETE');
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.getLabelsForBoard = function(boardId) {
    var request = this.constructRequest(`/1/boards/${boardId}/labels`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.addLabelOnBoard = function(boardId, name, color) {
    var request = this.constructRequest('/1/labels', 'POST', {
        idBoard: boardId,
        color,
        name,
    });
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.deleteLabel = function(labelId) {
    var request = this.constructRequest(`/1/labels/${labelId}`, 'DELETE');
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addLabelToCard = function(cardId, labelId) {
    var request = this.constructRequest(`/1/cards/${cardId}/idLabels`, 'POST', {
        value: labelId,
    });
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.deleteLabelFromCard = function(cardId, labelId) {
    var request = this.constructRequest(
        `/1/cards/${cardId}/idLabels/${labelId}`,
        'DELETE'
    );
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.updateLabel = function(labelId, params) {
    const query = this.handleMultipleParams({}, params);

    var request = this.constructRequest(`/1/labels/${labelId}`, 'PUT', query);
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.updateLabelName = function(labelId, name) {
    return this.updateLabel(labelId, { name });
};

Trello.prototype.updateLabelColor = function(labelId, color) {
    return this.updateLabel(labelId, { color });
};

Trello.prototype.getCardStickers = function(cardId) {
    var request = this.constructRequest(`/1/cards/${cardId}/stickers`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.addDueDateToCard = function(cardId, dateValue) {
    var request = this.constructRequest(`/1/cards/${cardId}/due`, 'PUT', {
        value: dateValue,
    });
    return makeRequest(request.url, request.data, request.method);
};

module.exports = Trello;
