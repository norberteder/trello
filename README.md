# trello_ex
## A simple asynchronous client for [Trello](http://www.trello.com)

This is a wrapper for some of the Trello HTTP API. Please feel free to add any other pieces you need! :)

  The original version was published [here](https://github.com/GraemeF/trello), but isn't maintained any more. I added some new functions for a better support of Trello; also node module 'restler' has been replaced due to compatibility issues with node 0.10.x (and it seems not to be maintained anymore).

## Installation
    npm install trello_ex

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

### 0.2.0

* `getBoards` added
