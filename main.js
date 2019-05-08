const { makeRequest } = require("./library/helpers");

const {
    addBoard,
    updateBoardPref,
    addListToBoard,
    addMemberToBoard,
    getBoardMembers,
    getListsOnBoard,
    getListsOnBoardByFilter,
    getCardsOnBoard,
    getLabelsForBoard,
    addLabelOnBoard,
    getCardsOnBoardWithExtraParams
} = require("./library/boards");

const {
    addCard,
    addCardWithExtraParams,
    getCard,
    addCommentToCard,
    addAttachmentToCard,
    addMemberToCard,
    addChecklistToCard,
    addExistingChecklistToCard,
    getChecklistsOnCard,
    updateCard,
    addLabelToCard,
    deleteLabelFromCard,
    getCardStickers,
    addDueDateToCard,
    deleteCard
} = require("./library/cards");

const {
    renameList,
    getCardsForList,
    getCardsOnList,
    getCardsOnListWithExtraParams
} = require("./library/lists");

const { getBoards, getMember, getMemberCards } = require("./library/members");
const { getOrgBoards, getOrgMembers } = require("./library/organizations");
const { addItemToChecklist, updateChecklist } = require("./library/checklists");
const { updateLabel, deleteLabel } = require("./library/labels");
const { addWebhook, deleteWebhook } = require("./library/webhooks");

class Trello {
    constructor(key, token) {
        this.key = key;
        this.token = token;
    }

    createQuery() {
        return { key: this.key, token: this.token };
    }

    //api call
    makeRequest(method, path, options) {
        if (!["GET", "POST", "DELETE", "PUT"].includes(method))
            throw new Error(
                "Unsupported requestMethod. Pass one of these methods: POST, GET, PUT, DELETE."
            );

        if (typeof method !== "string")
            throw new TypeError("method should be a string");

        if (options && typeof options !== "object")
            throw new TypeError("options should be an object");

        return makeRequest(path, method, options);
    }

    //api calls to board
    addBoard(name, description, teamId) {
        return addBoard(name, description, teamId, this.key, this.token);
    }

    updateBoardPref(boardId, extraParams, key, token) {
        //extra params: {name: 'new board name'}
        return updateBoardPref(boardId, extraParams, this.key, this.token);
    }

    addListToBoard(boardId, name) {
        return addListToBoard(boardId, name, this.key, this.token);
    }

    addMemberToBoard(boardId, memberId, memberRights) {
        return addMemberToBoard(
            boardId,
            memberId,
            memberRights,
            this.key,
            this.token
        );
    }

    getBoardMembers(boardId) {
        return getBoardMembers(boardId, this.key, this.token);
    }

    getListsOnBoard(boardId) {
        return getListsOnBoard(boardId, this.key, this.token);
    }

    getListsOnBoardByFilter(boardId, filter) {
        return getListsOnBoardByFilter(boardId, filter, this.key, this.token);
    }

    getCardsOnBoard(boardId) {
        return getCardsOnBoard(boardId, this.key, this.token);
    }

    getLabelsForBoard(boardId) {
        return getLabelsForBoard(boardId, this.key, this.token);
    }

    addLabelOnBoard(boardId, name, color) {
        return addLabelOnBoard(boardId, name, color, this.key, this.token);
    }

    getCardsOnBoardWithExtraParams(boardId, extraParam) {
        return getCardsOnBoardWithExtraParams(
            boardId,
            extraParam,
            this.key,
            this.token
        );
    }

    //api calls to cards
    addCard(name, listId) {
        return addCard(name, listId, this.key, this.token);
    }

    addCardWithExtraParams(name, extraParams, listId) {
        return addCardWithExtraParams(
            name,
            extraParams,
            listId,
            this.key,
            this.token
        );
    }

    getCard(cardId) {
        return getCard(cardId, this.key, this.token);
    }

    addMemberToCard(cardId, memberId) {
        return addMemberToCard(cardId, memberId, this.key, this.token);
    }

    addCommentToCard(cardId, comment) {
        return addCommentToCard(cardId, comment, this.key, this.token);
    }

    addAttachmentToCard(cardId, url) {
        return addAttachmentToCard(cardId, url, this.key, this.token);
    }

    addChecklistToCard(cardId, name) {
        return addChecklistToCard(cardId, name, this.key, this.token);
    }

    addExistingChecklistToCard(cardId, checklistId) {
        return addExistingChecklistToCard(
            cardId,
            checklistId,
            this.key,
            this.token
        );
    }

    getChecklistsOnCard(cardId) {
        return getChecklistsOnCard(cardId, this.key, this.token);
    }

    updateCard(cardId, params) {
        return updateCard(cardId, params, this.key, this.token);
    }

    updateCardName(cardId, name) {
        return this.updateCard(cardId, { name });
    }

    updateCardDescription(cardId, description) {
        return this.updateCard(cardId, { desc: description });
    }

    updateCardList(cardId, listId) {
        return this.updateCard(cardId, { idList: listId });
    }

    addLabelToCard(cardId, labelId) {
        return addLabelToCard(cardId, labelId, this.key, this.token);
    }

    deleteLabelFromCard(cardId) {
        return deleteLabelFromCard(cardId, labelId, this.key, this.token);
    }

    getCardStickers(cardId) {
        return getCardStickers(cardId, this.key, this.token);
    }

    addDueDateToCard(cardId, dateValue) {
        return addDueDateToCard(cardId, dateValue, this.key, this.token);
    }

    deleteCard(cardId) {
        return deleteCard(cardId, this.key, this.token);
    }

    //api calls to list
    getCardsForList(listId) {
        return getCardsForList(listId, this.key, this.token);
    }

    renameList(listId, name) {
        return renameList(listId, name, this.key, this.token);
    }

    getCardsOnList(listId) {
        return getCardsOnList(listId, this.key, this.token);
    }

    getCardsOnListWithExtraParams(listId, fields) {
        return getCardsOnListWithExtraParams(
            listId,
            fields,
            this.key,
            this.token
        );
    }

    //api calls to members
    getBoards(memberId) {
        return getBoards(memberId, this.key, this.token);
    }

    getMember(memberId) {
        const request = this.constructRequest(`/1/member/${memberId}`, "GET");
        return getMember(memberId, this.key, this.token);
    }

    getMemberCards(memberId) {
        return getMemberCards(memberId, this.key, this.token);
    }

    //api calls to organizations
    getOrgBoards(organizationId) {
        return getOrgBoards(organizationId, this.key, this.token);
    }

    getOrgMembers(organizationId) {
        return getOrgMembers(organizationId, this.key, this.token);
    }

    //api calls to checklist
    addItemToChecklist(checkListId, name, position) {
        return addItemToChecklist(
            checkListId,
            name,
            position,
            this.key,
            this.token
        );
    }

    updateChecklist(checklistId, params) {
        return updateChecklist(checklistId, params, this.key, this.token);
    }

    //api calls to labels

    updateLabel(labelId, params) {
        return updateLabel(labelId, params, this.key, this.token);
    }

    updateLabelName(labelId, name) {
        this.updateLabel(labelId, { name });
    }

    updateLabelColor(labelId, color) {
        this.updateLabel(labelId, { color });
    }

    deleteLabel(labelId) {
        return deleteLabel(labelId, this.key, this.token);
    }

    //api calls to webhook

    addWebhook(description, callbackURL, idModel) {
        return addWebhook(
            description,
            callbackURL,
            idModel,
            this.key,
            this.token
        );
    }

    deleteWebhook(webhookId) {
        return deleteWebhook(webhookId, this.key, this.token);
    }
}

module.exports = Trello;
