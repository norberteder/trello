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

## History

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
