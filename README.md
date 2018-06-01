[![Build Status](https://travis-ci.org/norberteder/trello.svg?branch=master)](https://travis-ci.org/norberteder/trello)

# trello
## A simple asynchronous client for [Trello](http://www.trello.com)

This is a wrapper for some of the Trello HTTP API. Please feel free to add any other pieces you need! :)

## Installation
    npm install trello

## Usage
Log in to Trello and visit [trello.com/app-key](https://trello.com/app-key) to get a `token` and `app key`. These need to be supplied when you create the Trello object (see below).

## Example
```javascript
  var Trello = require("trello");
  var trello = new Trello("MY APPLICATION KEY", "MY USER TOKEN");

  trello.addCard('Clean car', 'Wax on, wax off', myListId,
      function (error, trelloCard) {
          if (error) {
              console.log('Could not add card:', error);
          }
          else {
              console.log('Added card:', trelloCard);
          }
      });
```

## Callback or promise
API calls can either execute a callback or return a promise. To return a promise just omit the callback parameter.

```javascript
  //Callback
  trello.getCardsOnList(listId, callback);

  //Promise
  var cardsPromise = trello.getCardsOnList(listId);
  cardsPromise.then((cards) => {
    //do stuff
  })
```

## Requests to API endpoints, not supported by this lib yet

```javascript
    // Get all registered tokens and webhooks
    // Url will look like: https://api.trello.com/1/members/me/tokens?webhooks=true&key=YOURKEY&token=YOURTOKEN
    trello.makeRequest('get', '/1/members/me/tokens', { webhooks: true })
      .then((res) => {
          console.log(res)
      });
```

## Available functions

### Add

* addAttachmentToCard 
* addBoard 
* addCard 
* addCardWithExtraParams 
* addChecklistToCard 
* addCommentToCard 
* addDueDateToCard 
* addExistingChecklistToCard 
* addItemToChecklist 
* addLabelOnBoard 
* addLabelToCard 
* addListToBoard 
* addMemberToBoard 
* addMemberToCard 
* addStickerToCard 
* addWebhook 

### Delete

* deleteCard 
* deleteLabel 
* deleteLabelFromCard 
* deleteWebhook 

### Get

* getBoardMembers 
* getBoards 
* getCard 
* getCardsForList 
* getCardsOnBoard 
* getCardsOnBoardWithExtraParams 
* getCardsOnList 
* getCardsOnListWithExtraParams
* getCardStickers
* getChecklistsOnCard 
* getLabelsForBoard 
* getListsOnBoard 
* getListsOnBoardByFilter 
* getMember 
* getMemberCards 
* getOrgBoards 
* getOrgMembers 

### Update

* renameList 
* updateBoardPref 
* updateCard 
* updateCardDescription 
* updateCardList 
* updateCardName 
* updateChecklist 
* updateLabel 
* updateLabelColor 
* updateLabelName 

Everything that is not available as a function can be requested by calling `makeRequest`.

## History

### 0.9.0

* New function `getCardsOnBoardWithExtraParams`
* New function `getCardsOnListWithExtraParams`
* New function `addDueDateToCard`

### 0.8.0

* Rename list fixed
* Handle API rate limit by retries 
* New function `addCardWithExtraParams` 

### 0.7.0

* Public visibility for `makeRequest`

### 0.6.0

* added `getMember`
* added `getCardStickers`
* added `addStickerToCard`
* added `getOrgBoards`
* added `getMemberCards`
* added `updateBoardPref`
* added `addMemberToBoard`

### 0.5.1

* added `renameList`
* added `addChecklistToCard`
* added `getChecklistsOnCard`
* added `addExistingChecklistToCard`
* added `updateChecklist`
* added `getOrgMembers`
* API methods now return the promise

### 0.5.0

* Support of promises
* Basic support of Labeling:
  * getLabelsForBoard
  * addLabelOnBoard
  * deleteLabel
  * addLabelToCard
  * deleteLabelFromCard

### 0.4.1

* Updated dev dependencies

### 0.4.0

* One-time listener
* `addAttachmentToCard` added
* Updated `restler` dependency
* Node.js support >= 0.10.x / removed 0.6 and 0.8

### 0.3.0

* Project `trello_ex` merged again with original project `trello`
* Using 'restler' again

### 0.2.0

* `getBoards` added
