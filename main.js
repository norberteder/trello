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
        return addBoard(this.key, this.token, name, description, teamId);
    }

    updateBoardPref(boardId, extraParams, key, token) {
        //extra params: {name: 'new board name'}
        return updateBoardPref(this.key, this.token, boardId, extraParams);
    }

    addListToBoard(boardId, name) {
        return addListToBoard(this.key, this.token, boardId, name);
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
        return getBoardMembers(this.key, this.token, boardId);
    }

    getListsOnBoard(boardId) {
        return getListsOnBoard(this.key, this.token, boardId);
    }

    getListsOnBoardByFilter(boardId, filter) {
        return getListsOnBoardByFilter(this.key, this.token, boardId, filter);
    }

    getCardsOnBoard(boardId) {
        return getCardsOnBoard(this.key, this.token, boardId);
    }

    getLabelsForBoard(boardId) {
        return getLabelsForBoard(this.key, this.token, boardId);
    }

    addLabelOnBoard(boardId, name, color) {
        return addLabelOnBoard(this.key, this.token, boardId, name, color);
    }

    getCardsOnBoardWithExtraParams(boardId, extraParam) {
        return getCardsOnBoardWithExtraParams(
            this.key,
            this.token,
            boardId,
            extraParam
        );
    }

    //api calls to cards
    addCard(name, listId) {
        return addCard(this.key, this.token, name, listId);
    }

    addCardWithExtraParams(name, extraParams, listId) {
        return addCardWithExtraParams(
            this.key,
            this.token,
            name,
            extraParams,
            listId
        );
    }

    getCard(cardId) {
        return getCard(this.key, this.token, cardId);
    }

    addMemberToCard(cardId, memberId) {
        return addMemberToCard(this.key, this.token, cardId, memberId);
    }

    addCommentToCard(cardId, comment) {
        return addCommentToCard(this.key, this.token, cardId, comment);
    }

    addAttachmentToCard(cardId, url) {
        return addAttachmentToCard(this.key, this.token, cardId, url);
    }

    addChecklistToCard(cardId, name) {
        return addChecklistToCard(this.key, this.token, cardId, name);
    }

    addExistingChecklistToCard(cardId, checklistId) {
        return addExistingChecklistToCard(
            this.key,
            this.token,
            cardId,
            checklistId
        );
    }

    getChecklistsOnCard(cardId) {
        return getChecklistsOnCard(this.key, this.token, cardId);
    }

    updateCard(cardId, params) {
        return updateCard(this.key, this.token, cardId, params);
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
        return addLabelToCard(this.key, this.token, cardId, labelId);
    }

    deleteLabelFromCard(cardId) {
        return deleteLabelFromCard(this.key, this.token, cardId, labelId);
    }

    getCardStickers(cardId) {
        return getCardStickers(this.key, this.token, cardId);
    }

    addDueDateToCard(cardId, dateValue) {
        return addDueDateToCard(this.key, this.token, cardId, dateValue);
    }

    deleteCard(cardId) {
        return deleteCard(this.key, this.token, cardId);
    }

    //api calls to list
    getCardsForList(listId) {
        return getCardsForList(this.key, this.token, listId);
    }

    renameList(listId, name) {
        return renameList(this.key, this.token, listId, name);
    }

    getCardsOnList(listId) {
        return getCardsOnList(this.key, this.token, listId);
    }

    getCardsOnListWithExtraParams(listId, fields) {
        return getCardsOnListWithExtraParams(
            this.key,
            this.token,
            listId,
            fields
        );
    }

    //api calls to members
    getBoards(memberId) {
        return getBoards(this.key, this.token, memberId);
    }

    getMember(memberId) {
        const request = this.constructRequest(`/1/member/${memberId}`, "GET");
        return getMember(this.key, this.token, memberId);
    }

    getMemberCards(memberId) {
        return getMemberCards(this.key, this.token, memberId);
    }

    //api calls to organizations
    getOrgBoards(organizationId) {
        return getOrgBoards(this.key, this.token, organizationId);
    }

    getOrgMembers(organizationId) {
        return getOrgMembers(this.key, this.token, organizationId);
    }

    //api calls to checklist
    addItemToChecklist(checkListId, name, position) {
        return addItemToChecklist(
            this.key,
            this.token,
            checkListId,
            name,
            position
        );
    }

    updateChecklist(checklistId, params) {
        return updateChecklist(this.key, this.token, checklistId, params);
    }

    //api calls to labels

    updateLabel(labelId, params) {
        return updateLabel(this.key, this.token, labelId, params);
    }

    updateLabelName(labelId, name) {
        this.updateLabel(labelId, { name });
    }

    updateLabelColor(labelId, color) {
        this.updateLabel(labelId, { color });
    }

    deleteLabel(labelId) {
        return deleteLabel(this.key, this.token, labelId);
    }

    //api calls to webhook

    addWebhook(description, callbackURL, idModel) {
        return addWebhook(
            this.key,
            this.token,
            description,
            callbackURL,
            idModel
        );
    }

    deleteWebhook(webhookId) {
        return deleteWebhook(this.key, this.token, webhookId);
    }
}

module.exports = Trello;
