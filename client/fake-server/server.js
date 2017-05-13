'use strict';

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

var hiveBoardStateMove = `
{
  "tag": "game_state_move",
  "contents": {
    "board" : { 
      "rows": 9,
      "cols": 11,
      "parity": false,
      "cells": [
        {
          "row" : 4,
          "col" : 2,
          "tiles" : [
            {"bug" : "beetle", "color" : "white"}
          ]
        },
        {
          "row" : 4,
          "col" : 3,
          "tiles" : [
            {"bug" : "ant",    "color" : "white"},
            {"bug" : "spider", "color" : "black"}
          ]
        },
        {
          "row" : 5,
          "col" : 4,
          "tiles" : [
            {"bug" : "queen",  "color" : "black"}
          ]
        }
      ]
    }
  }
}
`;

var hiveBoardStateSelect = `
{
  "tag": "game_state_select",
  "contents": {
    "board" : { 
      "rows": 9,
      "cols": 11,
      "parity": false,
      "cells": [
        {
          "row" : 4,
          "col" : 2,
          "tiles" : [
            {"bug" : "beetle", "color" : "white"}
          ]
        },
        {
          "row" : 4,
          "col" : 3,
          "tiles" : [
            {"bug" : "grasshopper", "color" : "black"},
            {"bug" : "spider",      "color" : "white"},
            {"bug" : "ant",         "color" : "white"},
            {"bug" : "spider",      "color" : "black"}
          ]
        },
        {
          "row" : 5,
          "col" : 4,
          "tiles" : [
            {"bug" : "queen",  "color" : "white"}
          ]
        }
      ]
    }
  }
}
`;

io.on('connection', (socket) => {
  console.log('CLIENT connected...');

  socket.on('disconnect', function(){
    console.log('...CLIENT disconnected');
  });

  socket.on('add-message', (message) => {
  	console.log('->USER sent this message: ' + message);
    var response = '';
    switch(message) {
      case 'move':
        response = hiveBoardStateMove;
        break;
      case 'select':
        response = hiveBoardStateSelect;
        break;
      default:
        response = 'server got an UNKNOWN request === ' + message;
    }
    io.emit('message', {type:'new-message', text: response});
  });
});

http.listen(8080, () => {
  console.log('started on port 8080');
});
