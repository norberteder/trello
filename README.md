[![Build Status](https://travis-ci.org/norberteder/trello.svg?branch=master)](https://travis-ci.org/norberteder/trello)

# trello
## A simple asynchronous client for [Trello](http://www.trello.com)

This is a wrapper for some of the Trello HTTP API. Please feel free to add any other pieces you need! :)

## Installation
    npm install trello

## Usage
First, generate your Trello application key [like this](https://trello.com/card/generating-your-developer-key/4ed7e27fe6abb2517a21383d/25), then follow [these confusing instructions](https://trello.com/card/getting-a-user-token-and-oauth-urls/4ed7e27fe6abb2517a21383d/26) to get a user token. These need to be supplied when you create the Trello object (see below).

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

## History

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
