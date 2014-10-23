# trello
## A simple asynchronous client for [Trello](http://www.trello.com)

This is a wrapper for some of the Trello HTTP API. Please feel free to add any other pieces you need! :)

## Installation
    npm install trello

## Usage
First, generate your Trello application key [like this](https://trello.com/card/generating-your-developer-key/4ed7e27fe6abb2517a21383d/25), then follow [these confusing instructions](https://trello.com/card/getting-a-user-token-and-oauth-urls/4ed7e27fe6abb2517a21383d/26) to get a user token. These need to be supplied when you create the Trello object (see below).
 
## Example
```javascript
  var Trello = require("trello_ex");
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

### 0.3.0

* Project `trello_ex` merged again with original project `trello`
* Using 'restler' again

### 0.2.0

* `getBoards` added