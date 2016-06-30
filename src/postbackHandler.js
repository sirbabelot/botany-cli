"use strict";
const request = require('superagent');
const fbAccessToken = process.env.FB_ACCESS_TOKEN;
const fs = require('fs');


function handlePostback(event) {
  console.warn('Postbacks currently disabled');
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

module.exports = handlePostback;
