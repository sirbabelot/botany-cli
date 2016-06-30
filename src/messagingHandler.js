"use strict";
const request = require('superagent');
const fbAccessToken = process.env.FB_ACCESS_TOKEN;
const fs = require('fs');
const statelessEngine = require('./src/statelessEngine.js');


// Hack (Morgan), but a small one since the chat bot expects a reset on the
// first message
var isFirstMessage = true;


function handleMessageEvent(event) {
  let sender = event.sender.id;
  if (event.message && event.message.text) {
    let text = event.message.text;
    let message = { body: text };
    if (isFirstMessage || text === 'r') {
      message.reset = true;
      isFirstMessage = false;
    }

    statelessEngine
      .computeResponse(message.body)
      .then( responses => {
        responses.forEach((response) => {
          sendMessage(sender, response);
        });
      } );
  }
}

function sendMessage(sender, message) {
  request.post('https://graph.facebook.com/v2.6/me/messages')
    .query({access_token: fbAccessToken})
    .send({
          recipient: {id: sender},
          message,
    })
    .end(callback);

  function callback (error, response) {
    if (error) {
      fs.writeFile('fb_log.json', JSON.stringify(error, null, '\t'), 'utf8', () => {});
    } else if (response.body.error) {
        console.warn('Error: ', response.body.error)
    }
  }
}

module.exports = handleMessageEvent;
