require('es6-promise').polyfill();
require('cross-fetch/polyfill');

const Trello = (key, token) => {
    this.key = key;
    this.token = token;
};

Trello.prototype.createQuery = () => {
    return { key: this.key, token: this.token };
};

Trello.prototype.constructRequest = (path, method, options, extraOption) => {
    if (!['GET', 'POST', 'DELETE', 'PUT'].includes(method))
        throw new Error(
            'Unsupported requestMethod. Pass one of these methods: POST, GET, PUT, DELETE.'
        );

    const query = this.createQuery();
    const baseUrl = 'https://api.trello.com';

    if (method === 'GET') {
        const queryString = `?key=${query.key}&token=${query.token}`;

        //pure GET function
        if (!options) return { url: `${baseUrl}${path}${queryString}` };

        if (Array.isArray(options))
            return {
                url: `${baseUrl}${path}${queryString}&${extraOption}=${options.join(
                    ','
                )}`,
            };

        const keys = Object.keys(options);
        const values = Object.values(options);
        const additionalQueries = keys
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

Trello.prototype.handleMultipleParams = (objToPopulate, paramsObject) => {
    const keys = Object.keys(paramsObject);
    const values = Object.values(paramsObject);
    keys.map((key, index) => (objToPopulate[key] = values[index]));
    return objToPopulate;
};

const makeRequest = (url, options, requestMethod) => {
    if (requestMethod === 'GET') return fetch(url);

    return fetch(url, {
        method: requestMethod,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
    });
};

Trello.prototype.makeRequest = (requestMethod, path, options) => {
    if (['GET', 'POST', 'DELETE', 'PUT'].includes(method))
        throw new Error(
            'Unsupported requestMethod. Pass one of these methods: POST, GET, PUT, DELETE.'
        );

    if (typeof options !== 'object')
        throw new TypeError('options should be an object');

    return makeRequest(path, options, requestMethod);
};

Trello.prototype.addBoard = (name, description, teamId) => {
    if (!name || !description || !teamId)
        throw new Error(
            'Unable to create board because either a name, description or a team id was not supplied'
        );

    const request = this.constructRequest('/1/boards', 'POST', {
        name,
        desc: description,
        idOrganization: teamId,
    });

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.updateBoardPref = (boardId, extraParams) => {
    if (!boardId || !extraParams)
        throw new Error(
            'Unable to create board because either a boardId, fieldToChange or a value id was not supplied'
        );

    const query = this.handleMultipleParams({}, extraParams);
    const request = this.constructRequest(`/1/boards/${boardId}`, 'PUT', query);

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addCard = (name, listId) => {
    if (!listId || !name || !description)
        throw new Error(
            'Unable to create board because either a listId, name or a description id was not supplied'
        );

    const request = this.constructRequest('/1/cards/', 'POST', { name });

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addCardWithExtraParams = (name, extraParams, listId) => {
    if (!listId || !name || !extraParams)
        throw new Error(
            'Unable to create board because either a listId, name or extra parameters were not supplied'
        );

    const query = this.handleMultipleParams(
        { name, idList: listId },
        extraParams
    );
    const request = this.constructRequest('/1/cards/', 'POST', query);

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.getCard = cardId => {
    const request = this.constructRequest(`/1/cards/${cardId}`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getCardsForList = listId => {
    const request = this.constructRequest(`/1/lists/${listId}`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.renameList = (listId, name) => {
    const request = this.constructRequest(`/1/lists/${listId}/name`, 'PUT', {
        value: name,
    });

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addListToBoard = (boardId, name) => {
    const request = this.constructRequest(
        `/1/boards/${boardId}/lists`,
        'POST',
        {
            name,
        }
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addMemberToBoard = (boardId, memberId, memberRights) => {
    if (!boardId || !memberId || !memberRights)
        throw new Error(
            'Unable to create board because either a boardId, memberId or memberRights were not supplied'
        );

    const request = this.constructRequest(
        `/1/boards/${boardId}/members/${memberId}`,
        'PUT',
        {
            type: memberRights,
        }
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addCommentToCard = (cardId, comment) => {
    const request = this.constructRequest(
        `/1/cards/${cardId}/actions/comments`,
        'POST',
        {
            text: comments,
        }
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addAttachmentToCard = (cardId, url) => {
    const request = this.constructRequest(
        `/1/cards/${cardId}/attachments`,
        'POST',
        { url }
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addMemberToCard = (cardId, memberId) => {
    const request = this.constructRequest(
        `/1/cards/${cardId}/members`,
        'POST',
        {
            value: memberId,
        }
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.getBoards = memberId => {
    const request = this.constructRequest(
        `/1/members/${memberId}/boards`,
        'GET'
    );
    return makeRequest(request.url);
};

Trello.prototype.getOrgBoards = organizationId => {
    const request = this.constructRequest(
        `/1/organizations/${organizationId}/boards`,
        'GET'
    );
    return makeRequest(request.url);
};

Trello.prototype.addChecklistToCard = (cardId, name) => {
    const request = this.constructRequest(
        `/1/cards/${cardId}/checklists`,
        'POST',
        { name }
    );
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addExistingChecklistToCard = (cardId, checklistId) => {
    const request = this.constructRequest(
        `/1/cards/${cardId}/checklists`,
        'POST',
        { idChecklistSource: checklistId }
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.getChecklistsOnCard = cardId => {
    const request = this.constructRequest(
        `/1/cards/${cardId}/checklists`,
        'GET'
    );
    return makeRequest(request.url);
};

Trello.prototype.addItemToChecklist = (checkListId, name, pos) => {
    const request = this.constructRequest(
        `/1/checklists/${checkListId}/checkitems`,
        'POST',
        { name, pos }
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.updateCard = (cardId, params) => {
    const query = this.handleMultipleParams({}, params);
    const request = this.constructRequest(`/1/cards/${cardId}`, 'PUT', query);

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.updateChecklist = (checklistId, params) => {
    const query = this.handleMultipleParams({}, params);
    const request = this.constructRequest(
        `/1/checklists/${checklistId}`,
        'PUT',
        query
    );

    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.updateCardName = (cardId, name) =>
    this.updateCard(cardId, { name });

Trello.prototype.updateCardDescription = (cardId, description) =>
    this.updateCard(cardId, { desc: description });

Trello.prototype.updateCardList = (cardId, listId) =>
    this.updateCard(cardId, { idList: listId });

Trello.prototype.getMember = memberId => {
    const request = this.constructRequest(`/1/member/${memberId}`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getMemberCards = memberId => {
    const request = this.constructRequest(`/1/member/${memberId}/cards`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getBoardMembers = boardId => {
    const request = this.constructRequest(
        `/1/boards/${boardId}/members`,
        'GET'
    );
    return makeRequest(request.url);
};

Trello.prototype.getOrgMembers = organizationId => {
    const request = this.constructRequest(
        `/1/organizations/${organizationId}/members`,
        'GET'
    );
    return makeRequest(request.url);
};

Trello.prototype.getListsOnBoard = boardId => {
    const request = this.constructRequest(`/1/boards/${boardId}/lists`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getListsOnBoardByFilter = (boardId, filter) => {
    const request = this.constructRequest(`/1/boards/${boardId}/lists`, 'GET', {
        filter,
    });

    return makeRequest(request.url);
};

Trello.prototype.getCardsOnBoard = boardId => {
    const request = this.constructRequest(`/1/boards/${boardId}/cards`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getCardsOnBoardWithExtraParams = (boardId, extraParam) => {
    const request = this.constructRequest(
        `/1/boards/${boardId}/cards/${extraParam}`,
        'GET'
    );

    return makeRequest(request.url);
};

Trello.prototype.getCardsOnList = listId => {
    const request = this.constructRequest(`/1/lists/${listId}/cards`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.getCardsOnListWithExtraParams = (listId, fields) => {
    // e.g. trello.getCardsOnList('5c8a3b4eb42f42133e1ea998', ['id', 'name', 'badges']);
    const request = this.constructRequest(
        `/1/lists/${listId}/cards`,
        'GET',
        fields,
        'fields'
    );

    return makeRequest(request.url);
};

Trello.prototype.deleteCard = cardId => {
    const request = this.constructRequest(`/1/cards/${cardId}`, 'DELETE');
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addWebhook = (description, callbackURL, idModel) => {
    const request = this.constructRequest(`/1/webhooks`, 'POST', {
        description,
        callbackURL,
        idModel,
    });
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.deleteWebhook = webHookId => {
    //get the webhook id https://api.trello.com/1/tokens/[token]/webhooks/?key=[key]
    const request = this.constructRequest(`/1/webhooks/${webHookId}`, 'DELETE');
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.getLabelsForBoard = boardId => {
    const request = this.constructRequest(`/1/boards/${boardId}/labels`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.addLabelOnBoard = (boardId, name, color) => {
    const request = this.constructRequest('/1/labels', 'POST', {
        idBoard: boardId,
        color,
        name,
    });
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.deleteLabel = labelId => {
    const request = this.constructRequest(`/1/labels/${labelId}`, 'DELETE');
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.addLabelToCard = (cardId, labelId) => {
    const request = this.constructRequest(
        `/1/cards/${cardId}/idLabels`,
        'POST',
        {
            value: labelId,
        }
    );
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.deleteLabelFromCard = (cardId, labelId) => {
    const request = this.constructRequest(
        `/1/cards/${cardId}/idLabels/${labelId}`,
        'DELETE'
    );
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.updateLabel = (labelId, params) => {
    const query = this.handleMultipleParams({}, params);

    const request = this.constructRequest(`/1/labels/${labelId}`, 'PUT', query);
    return makeRequest(request.url, request.data, request.method);
};

Trello.prototype.updateLabelName = (labelId, name) =>
    this.updateLabel(labelId, { name });

Trello.prototype.updateLabelColor = (labelId, color) =>
    this.updateLabel(labelId, { color });

Trello.prototype.getCardStickers = cardId => {
    const request = this.constructRequest(`/1/cards/${cardId}/stickers`, 'GET');
    return makeRequest(request.url);
};

Trello.prototype.addDueDateToCard = (cardId, dateValue) => {
    const request = this.constructRequest(`/1/cards/${cardId}/due`, 'PUT', {
        value: dateValue,
    });
    return makeRequest(request.url, request.data, request.method);
};

module.exports = Trello;
